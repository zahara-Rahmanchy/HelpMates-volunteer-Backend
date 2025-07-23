import {ApplicationStatus, userRoles} from "@prisma/client";
import prisma from "../../../shared/prisma";
import {count} from "console";
import {SignupQueryParams, UserGrowthRecord} from "./MetaDataInterface";

const fetchDashboardMetaData = async (user: any) => {
  console.log("user: ", user);
  let metaData;

  if (user?.role === userRoles.Admin) {
    metaData = getAdminMetaData();
  }
  // } else if (user?.role === UserRole.SUPERADMIN) {
  //     metaData = getSuperAdminMetaData();
  // }
  else if (user?.role === userRoles.User) {
    metaData = getUserMetaData(user as any);
  }
  // else {
  //   metaData = getAdminMetaData();
  //   // throw new Error("Invalid user role!");
  // }

  return metaData;
};

const getAdminMetaData = async () => {
  const activeUsers = await prisma.user.count({
    where: {
      active: true,
      role: userRoles.User,
    },
  });
  const totalAdmins = await prisma.user.count({
    where: {
      active: true,
      role: userRoles.User,
    },
  });
  const totalOpportunities = await prisma.opportunity.count();
  const totalPendingApplication = await prisma.volunteerApplication.count({
    where: {
      status: "PENDING",
    },
  });

  const applicationStatusBarChart = (
    await prisma.volunteerApplication.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    })
  ).map(({status, _count}) => ({status, count: _count.id}));

  const opportunityStatusPieChart = await prisma.opportunity.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });

  const opportunityPieDataWithPercentages = opportunityStatusPieChart.map(
    item => {
      const percentage = parseFloat(
        ((item._count.id / totalOpportunities) * 100).toFixed(2)
      ); // Calculate percentage
      return {
        status: item.status,
        count: item._count.id,
        percentage: percentage,
      };
    }
  );

  // user over month
  const creatAt = await prisma.$queryRaw`

    Select 'createdAt' from users

  `;
  const dailyUserGrowth = await prisma.$queryRaw`
  SELECT 
      EXTRACT(MONTH FROM "createdAt") AS signup_month,
      COUNT(*)::INTEGER AS total_signups
  FROM 
      "users"
  WHERE 
      EXTRACT(YEAR FROM "createdAt") = 2024
  GROUP BY 
      EXTRACT(MONTH FROM "createdAt")
  ORDER BY 
      signup_month;
`;
  // Format the data for the frontend
  // const userGrowthData = dailyUserGrowth.map(record => ({
  //   date: record.date, // Already normalized to date
  //   count: record.count,
  // }));
  return {
    applicationStatusBarChart,
    opportunityPieDataWithPercentages,
    creatAt,
    // userGrowth,
    // userGrowthData,
    dailyUserGrowth,
    counts: {
      totalAdmins,
      activeUsers,
      totalOpportunities,
      PendingApplications: totalPendingApplication,
    },
  };
};
const getUserMetaData = async (user: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const totalApplications = await prisma.volunteerApplication.count({
    where: {
      userId: user?.id,
    },
  });

  const totalParticipated = await prisma.volunteerApplication.count({
    where: {
      userId: user?.id,
      status: ApplicationStatus.APPROVED,
    },
  });
  const applicationStatusBarChart = (
    await prisma.volunteerApplication.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
      where: {
        userId: user?.id,
      },
    })
  ).map(({status, _count}) => ({status, count: _count.id}));

  return {
    applicationStatusBarChart,
    counts: {totalApplications, totalParticipated},
  };
};

const getSignUps = async ({year, month}: SignupQueryParams) => {
  // const {year, month} = params;
  const currentDate = new Date();
  const selectedYear = year ? Number(year) : currentDate.getFullYear();
  const selectedMonth = month ? Number(month) : currentDate.getMonth() + 1;
  console.log("month ser:", month, "\n selected: ", selectedMonth);
  console.log("type of:", typeof month, "\n selected: ", typeof selectedMonth);
  const dailySignups = await prisma.$queryRaw`
    SELECT 
        EXTRACT(DAY FROM "createdAt") AS signup_day, 
        -- "createdAt"::DATE AS signup_day,
        COUNT(*)::INTEGER AS total_signups
    FROM 
        "users"
    WHERE 
        EXTRACT(YEAR FROM "createdAt") = ${selectedYear} 
        AND EXTRACT(MONTH FROM "createdAt") = ${selectedMonth}
    GROUP BY 
        signup_day
    ORDER BY 
        signup_day;
`;
  // signups in any year
  const monthlySignups = await prisma.$queryRaw`
        SELECT 
            TO_CHAR("createdAt", 'FMMonth') AS signup_month, 
            EXTRACT(MONTH FROM "createdAt") AS month_number, 
            COUNT(*)::INTEGER AS total_signups
        FROM 
            "users"
        WHERE 
            EXTRACT(YEAR FROM "createdAt") = ${selectedYear}
        GROUP BY 
            signup_month, month_number
        ORDER BY 
            EXTRACT(MONTH FROM "createdAt");
    `;
  return {dailySignups, monthlySignups};
};

// TODO
// const getMonthlySignupsByYear = async (year: number) => {
//   const userGrowth = await prisma.user.groupBy({
//     by: ["createdAt"],
//     _count: {
//       id: true,
//     },
//     where: {
//       createdAt: {
//         gte: new Date(`${year}-01-01`),
//         lt: new Date(`${year + 1}-01-01`), // Up to the end of the selected year
//       },
//     },
//     orderBy: {
//       createdAt: "asc",
//     },
//   });

//   // Process data to group by months
//   const monthlySignups = Array(12).fill(0); // Initialize with 0 for each month
//   userGrowth.forEach(({createdAt, _count}) => {
//     const month = new Date(createdAt).getMonth(); // Get the month (0-based index)
//     monthlySignups[month] += _count.id;
//   });

//   return monthlySignups;
// };

export const MetaService = {
  fetchDashboardMetaData,
  getSignUps,
};
