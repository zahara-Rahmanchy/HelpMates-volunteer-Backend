"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const fetchDashboardMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("user: ", user);
    let metaData;
    if ((user === null || user === void 0 ? void 0 : user.role) === client_1.userRoles.Admin) {
        metaData = getAdminMetaData();
    }
    // } else if (user?.role === UserRole.SUPERADMIN) {
    //     metaData = getSuperAdminMetaData();
    // }
    else if ((user === null || user === void 0 ? void 0 : user.role) === client_1.userRoles.User) {
        metaData = getUserMetaData(user);
    }
    // else {
    //   metaData = getAdminMetaData();
    //   // throw new Error("Invalid user role!");
    // }
    return metaData;
});
const getAdminMetaData = () => __awaiter(void 0, void 0, void 0, function* () {
    const activeUsers = yield prisma_1.default.user.count({
        where: {
            active: true,
            role: client_1.userRoles.User,
        },
    });
    const totalAdmins = yield prisma_1.default.user.count({
        where: {
            active: true,
            role: client_1.userRoles.User,
        },
    });
    const totalOpportunities = yield prisma_1.default.opportunity.count();
    const totalPendingApplication = yield prisma_1.default.volunteerApplication.count({
        where: {
            status: "PENDING",
        },
    });
    const applicationStatusBarChart = (yield prisma_1.default.volunteerApplication.groupBy({
        by: ["status"],
        _count: {
            id: true,
        },
    })).map(({ status, _count }) => ({ status, count: _count.id }));
    const opportunityStatusPieChart = yield prisma_1.default.opportunity.groupBy({
        by: ["status"],
        _count: {
            id: true,
        },
    });
    const opportunityPieDataWithPercentages = opportunityStatusPieChart.map(item => {
        const percentage = parseFloat(((item._count.id / totalOpportunities) * 100).toFixed(2)); // Calculate percentage
        return {
            status: item.status,
            count: item._count.id,
            percentage: percentage,
        };
    });
    // user over month
    const creatAt = yield prisma_1.default.$queryRaw `

    Select 'createdAt' from users

  `;
    const dailyUserGrowth = yield prisma_1.default.$queryRaw `
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
});
const getUserMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
        },
    });
    const totalApplications = yield prisma_1.default.volunteerApplication.count({
        where: {
            userId: user === null || user === void 0 ? void 0 : user.id,
        },
    });
    const totalParticipated = yield prisma_1.default.volunteerApplication.count({
        where: {
            userId: user === null || user === void 0 ? void 0 : user.id,
            status: client_1.ApplicationStatus.APPROVED,
        },
    });
    const applicationStatusBarChart = (yield prisma_1.default.volunteerApplication.groupBy({
        by: ["status"],
        _count: {
            id: true,
        },
        where: {
            userId: user === null || user === void 0 ? void 0 : user.id,
        },
    })).map(({ status, _count }) => ({ status, count: _count.id }));
    return {
        applicationStatusBarChart,
        counts: { totalApplications, totalParticipated },
    };
});
const getSignUps = (_a) => __awaiter(void 0, [_a], void 0, function* ({ year, month }) {
    // const {year, month} = params;
    const currentDate = new Date();
    const selectedYear = year ? Number(year) : currentDate.getFullYear();
    const selectedMonth = month ? Number(month) : currentDate.getMonth() + 1;
    console.log("month ser:", month, "\n selected: ", selectedMonth);
    console.log("type of:", typeof month, "\n selected: ", typeof selectedMonth);
    const dailySignups = yield prisma_1.default.$queryRaw `
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
    const monthlySignups = yield prisma_1.default.$queryRaw `
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
    return { dailySignups, monthlySignups };
});
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
exports.MetaService = {
    fetchDashboardMetaData,
    getSignUps,
};
