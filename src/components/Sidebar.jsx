import React from 'react';

export default function Sidebar() {
  const menuItems = [
    { title: 'الرئيسية (Dashboard)', icon: '📊' },
    { title: 'المنتجات (Products)', icon: '🛍️' },
    { title: 'الطلبات (Orders)', icon: '📦' },
    { title: 'المستخدمين (Users)', icon: '👥' },
    { title: 'الإعدادات (Settings)', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">
            K
          </div>
          <h1 className="text-xl font-bold tracking-wide">KODA Admin</h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition duration-200 text-right text-gray-300 hover:text-white"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.title}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-800 pt-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600/20 text-red-400 transition duration-200">
          <span className="text-xl">🚪</span>
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}