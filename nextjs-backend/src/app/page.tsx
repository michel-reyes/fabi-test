export default function HomePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Uber Eats Clone API</h1>
        <div className="mb-8">
          <p className="text-gray-700 mb-4">
            Welcome to the Uber Eats Clone API documentation. This API provides endpoints 
            for managing users, restaurants, menu items, and orders for a food delivery application.
          </p>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <p className="text-green-700 font-medium">API Status: Online</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Available Endpoints</h2>
        
        <div className="space-y-6">
          <EndpointSection 
            title="Authentication" 
            endpoints={[
              { method: "POST", path: "/api/register", description: "Register a new user" },
              { method: "POST", path: "/api/login", description: "Login and get access token" },
              { method: "GET", path: "/api/users/me", description: "Get current user information" },
            ]} 
          />
          
          <EndpointSection 
            title="Restaurants" 
            endpoints={[
              { method: "GET", path: "/api/restaurants", description: "Get all restaurants with optional filtering" },
              { method: "POST", path: "/api/restaurants", description: "Create a new restaurant (sellers and admins only)" },
              { method: "GET", path: "/api/restaurants/:restaurantId", description: "Get a specific restaurant" },
              { method: "PUT", path: "/api/restaurants/:restaurantId", description: "Update a restaurant (owner or admin only)" },
              { method: "DELETE", path: "/api/restaurants/:restaurantId", description: "Delete a restaurant (owner or admin only)" },
            ]} 
          />
          
          <EndpointSection 
            title="Menu Items" 
            endpoints={[
              { method: "GET", path: "/api/restaurants/:restaurantId/menu-items", description: "Get menu items for a restaurant" },
              { method: "POST", path: "/api/restaurants/:restaurantId/menu-items", description: "Create a menu item for a restaurant" },
              { method: "GET", path: "/api/menu-items/:itemId", description: "Get a specific menu item" },
              { method: "PUT", path: "/api/menu-items/:itemId", description: "Update a menu item" },
              { method: "DELETE", path: "/api/menu-items/:itemId", description: "Delete a menu item" },
            ]} 
          />
          
          <EndpointSection 
            title="Orders" 
            endpoints={[
              { method: "POST", path: "/api/orders", description: "Create a new order" },
              { method: "GET", path: "/api/orders", description: "Get orders (customers see their own, sellers see their restaurant orders, admins see all)" },
              { method: "GET", path: "/api/orders/:orderId", description: "Get a specific order" },
              { method: "PUT", path: "/api/orders/:orderId", description: "Update order status (sellers and admins only)" },
            ]} 
          />
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">API Usage</h2>
          <p className="text-gray-700 mb-4">
            To use this API, send HTTP requests to the endpoints listed above. Most endpoints require authentication
            via a Bearer token in the Authorization header. First register a user, then login to obtain a token.
          </p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>
              {`// Example request with authentication
fetch('/api/restaurants', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
})
.then(response => response.json())
.then(data => console.log(data));`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

type Endpoint = {
  method: string;
  path: string;
  description: string;
};

type EndpointSectionProps = {
  title: string;
  endpoints: Endpoint[];
};

function EndpointSection({ title, endpoints }: EndpointSectionProps): JSX.Element {
  return (
    <div>
      <h3 className="text-xl font-medium text-gray-800 mb-3">{title}</h3>
      <div className="bg-gray-50 rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {endpoints.map((endpoint, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium
                    ${endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' : 
                      endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                      endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {endpoint.method}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{endpoint.path}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{endpoint.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
