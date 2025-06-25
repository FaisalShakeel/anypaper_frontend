import OverdueTasks from "../components/admin/OverdueTasks";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
function OverDueTasksPage(){
    return(
        <AdminDashboardLayout>
            <OverdueTasks/>
        </AdminDashboardLayout>
        
    )
}
export default OverDueTasksPage