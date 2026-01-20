export default function Footer() {
  return (
    <footer className="w-full bg-black/80 text-gray-400 py-12 px-6 border-t border-white/10 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-4">FITTTRACK</h3>
          <p className="text-sm leading-relaxed">
            The world's most advanced biometric tracking system. 
            Powered by WebGL and AI.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">PLATFORM</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-[#00f3ff] cursor-pointer">Dashboard</li>
            <li className="hover:text-[#00f3ff] cursor-pointer">iOS App</li>
            <li className="hover:text-[#00f3ff] cursor-pointer">Android App</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">COMPANY</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-[#00f3ff] cursor-pointer">About: Vishwas Charan</li>
            {/* <li className="hover:text-[#00f3ff] cursor-pointer">Careers</li> */}
            <li className="hover:text-[#00f3ff] cursor-pointer">Contact: vishwascharan11@gmail.com</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">NEWSLETTER</h4>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Enter email" 
              className="bg-white/10 rounded-l-md px-4 py-2 w-full focus:outline-none text-white"
            />
            <button className="bg-[#00f3ff] text-black px-4 py-2 rounded-r-md font-bold hover:bg-white transition-colors">
              →
            </button>
          </div>
        </div>
      </div>
      <div className="text-center text-xs border-t border-white/5 pt-8">
        © 2026 FluxFit Inc. All rights reserved.
      </div>
    </footer>
  );
}