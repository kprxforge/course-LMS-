import { Settings, User, Lock, Save } from 'lucide-react';

export function AdminSettings() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="border-b-8 border-black pb-8 flex items-center justify-between rotate-[1deg] mt-4">
        <div>
           <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-black uppercase" style={{ WebkitTextStroke: '2px black', color: 'transparent' }}>
              <span className="text-neo-secondary" style={{ WebkitTextStroke: '0' }}>Admin Settings</span>
           </h1>
           <p className="font-bold text-lg uppercase tracking-widest bg-white border-4 border-black inline-block px-4 py-2 neo-shadow-sm rotate-[-1deg] mt-4">System configuration.</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white border-4 border-black p-6 sm:p-8 space-y-8 relative group transition-colors duration-300 neo-shadow-xl rotate-[1deg]">
          <h2 className="text-3xl font-black text-black uppercase tracking-tight flex items-center gap-4 border-b-4 border-black pb-4">
            <div className="bg-neo-accent p-2 border-2 border-black rotate-[-5deg]">
              <User className="w-8 h-8 text-black" strokeWidth={3} /> 
            </div>
            Admin Profile Info
          </h2>
          
          <div className="space-y-6 pt-6 border-t-4 border-black border-dashed">
            <div>
              <label className="block text-sm font-black text-black uppercase tracking-widest mb-2">Display Name</label>
              <input 
                type="text" 
                defaultValue="Super Admin"
                className="w-full px-4 py-3 bg-white border-4 border-black text-lg font-bold text-black focus:outline-none focus:bg-neo-accent focus:neo-shadow-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-black text-black uppercase tracking-widest mb-2">Admin Email</label>
              <input 
                type="email" 
                defaultValue="admin@auralms.com"
                className="w-full px-4 py-3 bg-gray-200 border-4 border-black text-lg font-bold text-black cursor-not-allowed"
                disabled
              />
            </div>
          </div>
        </div>

        <div className="bg-white border-4 border-black p-6 sm:p-8 space-y-8 relative group transition-colors duration-300 neo-shadow-xl rotate-[-1deg]">
          <h2 className="text-3xl font-black text-black uppercase tracking-tight flex items-center gap-4 border-b-4 border-black pb-4">
            <div className="bg-neo-secondary p-2 border-2 border-black rotate-[5deg]">
              <Lock className="w-8 h-8 text-black" strokeWidth={3}/> 
            </div>
            Security
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black text-black uppercase tracking-widest mb-2">Current Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 bg-white border-4 border-black text-lg font-bold text-black focus:outline-none focus:bg-neo-accent focus:neo-shadow-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-black text-black uppercase tracking-widest mb-2">New Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 bg-white border-4 border-black text-lg font-bold text-black focus:outline-none focus:bg-neo-accent focus:neo-shadow-sm transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button 
          className="flex items-center gap-3 bg-white text-black border-4 border-black px-8 py-4 font-black uppercase tracking-widest text-lg hover:bg-neo-accent transition-all neo-shadow-lg hover:-translate-y-1 hover:neo-shadow-xl active:translate-x-1 active:translate-y-1 active:shadow-none rotate-[-1deg]"
        >
          <Save className="w-6 h-6" strokeWidth={3}/>
          Save Configuration
        </button>
      </div>
    </div>
  );
}
