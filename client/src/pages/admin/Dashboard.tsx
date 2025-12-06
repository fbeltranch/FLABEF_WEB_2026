import { useAuth } from '@/lib/mock-auth';
import { Link } from 'wouter';
import { Shield, Users, AlertTriangle, Lock, LogOut, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminDashboard() {
  const { recoveryAttempts, users, unlockUser, logout } = useAuth();
  const blockedUsers = users.filter(u => u.blocked);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white">
             <Shield size={18} />
           </div>
           <span className="font-heading font-bold text-xl text-primary">FLABEF Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Super Admin</span>
          <Button variant="outline" size="sm" onClick={() => logout()}>
            <LogOut size={16} className="mr-2" /> Logout
          </Button>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex justify-between items-start">
                 <div>
                   <p className="text-sm text-muted-foreground font-medium">Total Users</p>
                   <h3 className="text-3xl font-bold mt-2">{users.length}</h3>
                 </div>
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
              </div>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex justify-between items-start">
                 <div>
                   <p className="text-sm text-muted-foreground font-medium">Blocked Accounts</p>
                   <h3 className="text-3xl font-bold mt-2 text-red-600">{blockedUsers.length}</h3>
                 </div>
                 <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Lock size={20} /></div>
              </div>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex justify-between items-start">
                 <div>
                   <p className="text-sm text-muted-foreground font-medium">Recovery Attempts (24h)</p>
                   <h3 className="text-3xl font-bold mt-2">{recoveryAttempts.length}</h3>
                 </div>
                 <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><AlertTriangle size={20} /></div>
              </div>
           </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recovery Logs */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
             <div className="p-6 border-b flex justify-between items-center">
               <h3 className="font-bold text-lg">Security Logs & Recoveries</h3>
               <Button variant="ghost" size="sm">Export CSV</Button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 text-muted-foreground font-medium">
                   <tr>
                     <th className="px-6 py-3">Time</th>
                     <th className="px-6 py-3">User ID</th>
                     <th className="px-6 py-3">Method</th>
                     <th className="px-6 py-3">IP</th>
                     <th className="px-6 py-3">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y">
                   {recoveryAttempts.map((log) => (
                     <tr key={log.id} className="hover:bg-gray-50">
                       <td className="px-6 py-3 text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</td>
                       <td className="px-6 py-3 font-medium">{log.userId}</td>
                       <td className="px-6 py-3 capitalize">{log.method.replace('_', ' + ')}</td>
                       <td className="px-6 py-3 font-mono text-xs">{log.ip}</td>
                       <td className="px-6 py-3">
                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                           log.status === 'success' ? 'bg-green-100 text-green-700' : 
                           log.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                         }`}>
                           {log.status}
                         </span>
                       </td>
                     </tr>
                   ))}
                   {recoveryAttempts.length === 0 && (
                     <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No recent activity</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
             <div className="p-6 border-b flex justify-between items-center">
               <h3 className="font-bold text-lg">User Management</h3>
               <div className="relative">
                 <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
                 <Input placeholder="Search DNI..." className="h-9 pl-8 w-[200px]" />
               </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 text-muted-foreground font-medium">
                   <tr>
                     <th className="px-6 py-3">Name</th>
                     <th className="px-6 py-3">DNI</th>
                     <th className="px-6 py-3">Role</th>
                     <th className="px-6 py-3">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y">
                   {users.map((user) => (
                     <tr key={user.id} className="hover:bg-gray-50">
                       <td className="px-6 py-3 font-medium">{user.fullName}</td>
                       <td className="px-6 py-3 text-muted-foreground">{user.dni}</td>
                       <td className="px-6 py-3">
                         <span className="px-2 py-1 border rounded-md text-xs">{user.role}</span>
                       </td>
                       <td className="px-6 py-3">
                         {user.blocked && (
                           <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => unlockUser(user.id)}>
                             Unlock
                           </Button>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}