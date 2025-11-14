import SalaryProcessingTable from '../../../components/payroll/SalaryProcessingTable'; // Adjusted path

const AdminPayrollPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Payroll Management (Admin)</h1>
      <SalaryProcessingTable />
    </div>
  );
};

export default AdminPayrollPage;