# TODO: Make Menu Items Dynamic Based on Role ID

## Information Gathered
- Roles: RETAILER, DISTRIBUTOR, DRIVER, SUPER_ADMIN
- Current sidebars have hardcoded menu items
- Role is stored in localStorage as 'userRole'
- Distributor menu: Dashboard, Orders, Inventory, Add Product, Delivery, Drivers, Reports, Payments, Alerts
- Retailer menu: Dashboard, Orders, Inventory, Add Product, Delivery, Find Distributor, Reports, Payments, Alerts
- Driver should open driver dashboard, but no specific menu defined yet
- Super Admin assumed same as Distributor

## Plan
- Create a utility function to get menu items based on role
- Update src/app/dashboard/Sidebar.jsx to use dynamic menu
- Update src/app/retailer/Sidebar.jsx to use dynamic menu
- For DRIVER, use a subset: Dashboard, Orders, Delivery, Reports, Alerts (assuming driver-specific)
- SUPER_ADMIN uses Distributor menu
- Get role from localStorage in Sidebar components

## Dependent Files to Edit
- src/app/dashboard/Sidebar.jsx
- src/app/retailer/Sidebar.jsx

## Followup Steps
- Test login with different roles to verify correct menu loading
- If driver dashboard needs separate implementation, create it
- Verify paths match existing routes

## Completed Tasks
- [x] Created getMenuItems function with role-based menu items
- [x] Updated src/app/dashboard/Sidebar.jsx to use dynamic menu based on localStorage role
- [x] Updated src/app/retailer/Sidebar.jsx to use dynamic menu based on localStorage role
- [x] Added useState and useEffect to load menu items on component mount
- [x] Updated user role display in sidebar to show actual role from localStorage
- [x] Created separate driver folder with layout, page, and sidebar
- [x] Updated UserLogin.js to redirect DRIVER role to /driver
- [x] Driver sidebar has specific menu items: Dashboard, Orders, Delivery, Reports, Alerts
- [x] Replaced REGION_ADMIN with SUPER_ADMIN in roles and menu configurations
- [x] Updated UserLogin.js to include SUPER_ADMIN instead of REGION_ADMIN
- [x] Updated src/app/retailer/Sidebar.jsx to replace REGION_ADMIN with SUPER_ADMIN
- [x] Updated src/app/distributor/Sidebar.jsx to replace REGION_ADMIN with SUPER_ADMIN
- [x] Updated TODO.md to reflect the role change
