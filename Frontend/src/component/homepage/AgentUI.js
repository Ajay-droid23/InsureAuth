import { useState } from 'react';
import { Home, FileText, ShoppingBag, HelpCircle, User } from 'lucide-react';

export default function AgentUI() {
  const [activeItem, setActiveItem] = useState('My Insurance');
  
  const menuItems = [
    { name: 'My Insurance', icon: <Home size={20} /> },
    { name: 'Requests', icon: <FileText size={20} /> },
    { name: 'Purchase History', icon: <ShoppingBag size={20} /> },
    { name: 'Help and Support', icon: <HelpCircle size={20} /> }
  ];
  
  const renderContent = () => {
   
        return (
          <div className="p-4">
            <h2 className='display-5 mt-5'>Select an option from the sidebar</h2>
          </div>
        );
    
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white" style={{ width: '250px' }}>
        {/* <div className="p-3 border-bottom border-secondary">
          <div className="d-flex align-items-center">
            <User size={24} className="me-2" />
            <div>
              <div className="fw-medium">John Doe</div>
              <div className="small text-secondary">Premium Member</div>
            </div>
          </div>
        </div> */}
        <nav>
          <ul className="nav flex-column py-5">
            {menuItems.map((item) => (
              <li key={item.name} className="nav-item py-3">
                <button
                  className={`nav-link d-flex align-items-center px-3 py-2 text-white ${
                    activeItem === item.name ? 'active bg-secondary bg-opacity-25' : ''
                  }`}
                  onClick={() => setActiveItem(item.name)}
                >
                  <span className="me-3">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
       
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}