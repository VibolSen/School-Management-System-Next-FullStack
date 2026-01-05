// components/admin/finance/FinanceDashboard.jsx
import DashboardCard from "@/components/dashboard/DashboardCard";
import BriefcaseIcon from "@/components/icons/BriefcaseIcon";

export default function FinanceDashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Finance Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Fees"
          description="Manage fee structures"
          icon={<BriefcaseIcon className="w-6 h-6" />}
          href="/admin/finance/fees"
        />
        <DashboardCard
          title="Invoices"
          description="Create and manage student invoices"
          icon={<BriefcaseIcon className="w-6 h-6" />}
          href="/admin/finance/invoices"
        />
        <DashboardCard
          title="Payments"
          description="Track and record payments"
          icon={<BriefcaseIcon className="w-6 h-6" />}
          href="/admin/finance/payments"
        />
        <DashboardCard
          title="Expenses"
          description="Track school expenses"
          icon={<BriefcaseIcon className="w-6 h-6" />}
          href="/admin/finance/expenses"
        />
      </div>
    </div>
  );
}
