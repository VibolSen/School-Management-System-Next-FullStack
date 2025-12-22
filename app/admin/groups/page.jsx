import GroupsManagementView from "@/components/group/GroupsManagementView";
export default function GroupPage() {
  return (
    <div className="flex flex-col gap-5">
      <GroupsManagementView role="admin" />
    </div>
  );
}