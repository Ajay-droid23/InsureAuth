import { useState } from 'react';
import { Home, FileText, ShoppingBag, HelpCircle, User } from 'lucide-react';

export default function Custui() {
  const [activeItem, setActiveItem] = useState('My Insurance');
  
  const menuItems = [
    { name: 'My Insurance', icon: <Home size={20} /> },
    { name: 'Requests', icon: <FileText size={20} /> },
    { name: 'Purchase History', icon: <ShoppingBag size={20} /> },
    { name: 'Help and Support', icon: <HelpCircle size={20} /> }
  ];
  
  const renderContent = () => {
    switch(activeItem) {
      case 'My Insurance':
        return (
          <div className="p-4 ">
           
            <div className="card mb-4 mt-4 ">
              <div className="card-body">
                <h3 className="card-title">Auto Insurance</h3>
                <p className="card-text">Policy #: AUTO-12345</p>
                <p className="card-text">Status: Active</p>
                <p className="card-text">Renewal Date: 12/31/2025</p>
                <button className="btn btn-primary mt-3">View Details</button>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Home Insurance</h3>
                <p className="card-text">Policy #: HOME-67890</p>
                <p className="card-text">Status: Active</p>
                <p className="card-text">Renewal Date: 08/15/2025</p>
                <button className="btn btn-primary mt-3">View Details</button>
              </div>
            </div>
          </div>
        );
      case 'Requests':
        return (
          <div className="p-4">
           
            <div className="card mb-4 mt-5">
              <div className="card-body">
                <h3 className="card-title mb-3">Open Requests</h3>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Request ID</th>
                      <th scope="col">Type</th>
                      <th scope="col">Date</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>REQ-001</td>
                      <td>Policy Change</td>
                      <td>05/01/2025</td>
                      <td><span className="badge bg-warning text-dark">Pending</span></td>
                    </tr>
                    <tr>
                      <td>REQ-002</td>
                      <td>Claim</td>
                      <td>05/05/2025</td>
                      <td><span className="badge bg-success">Approved</span></td>
                    </tr>
                  </tbody>
                </table>
                <button className="btn btn-primary mt-3">New Request</button>
              </div>
            </div>
          </div>
        );
      case 'Purchase History':
        return (
          <div className="p-4">
      
            <div className="card mt-5">
              <div className="card-body">
                <h3 className="card-title mb-3">Recent Transactions</h3>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Description</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>05/01/2025</td>
                      <td>Auto Insurance Premium</td>
                      <td>$125.00</td>
                      <td><span className="badge bg-success">Paid</span></td>
                    </tr>
                    <tr>
                      <td>04/01/2025</td>
                      <td>Auto Insurance Premium</td>
                      <td>$125.00</td>
                      <td><span className="badge bg-success">Paid</span></td>
                    </tr>
                    <tr>
                      <td>03/01/2025</td>
                      <td>Auto Insurance Premium</td>
                      <td>$125.00</td>
                      <td><span className="badge bg-success">Paid</span></td>
                    </tr>
                  </tbody>
                </table>
                <button className="btn btn-primary mt-3">Download Statement</button>
              </div>
            </div>
          </div>
        );
      case 'Help and Support':
        return (
          <div className="p-4">
       
            <div className="card mb-4 mt-5">
              <div className="card-body">
                <h3 className="card-title">Contact Us</h3>
                <p className="mb-2">Our support team is available 24/7 to assist you.</p>
                <div className="mb-2">
                  <span className="fw-bold me-2">Phone:</span>
                  <span>1-800-INSURANCE</span>
                </div>
                <div className="mb-2">
                  <span className="fw-bold me-2">Email:</span>
                  <span>support@insurancecompany.com</span>
                </div>
                <button className="btn btn-primary mt-3">Live Chat</button>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">FAQs</h3>
                <div className="mb-3">
                  <h4 className="fw-bold">How do I file a claim?</h4>
                  <p>You can file a claim through our mobile app, website, or by calling our claims department.</p>
                </div>
                <div className="mb-3">
                  <h4 className="fw-bold">When is my payment due?</h4>
                  <p>Payments are due on the 1st of each month. You can set up auto-pay in the Payment Settings.</p>
                </div>
                <div>
                  <h4 className="fw-bold">How do I update my policy?</h4>
                  <p>You can update your policy by submitting a request through the Requests tab.</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4">
            <h2>Select an option from the sidebar</h2>
          </div>
        );
    }
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