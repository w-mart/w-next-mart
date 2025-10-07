import React, { useState } from "react";
import "../style.css"

const UserSignUp = () => {
  const [userType, setUserType] = useState("Distributor");

  // Distributor fields
  const [distributor_address, setDistributor_address] = useState("");
  const [distributor_city, setDistributor_city] = useState("");
  const [distributor_contact_number, setDistributor_contact_number] = useState("");
  const [distributor_email, setDistributor_email] = useState("");
  const [distributor_password_hash, setDistributor_password_hash] = useState("");
  const [distributor_pin_code, setDistributor_pin_code] = useState("");
  const [distributor_shop_name, setDistributor_shop_name] = useState("");
  const [distributor_state, setDistributor_state] = useState("");
  const [distributor_user_name, setDistributor_user_name] = useState("");
  const [gstin_number, setGstin_number] = useState("");
  const [is_distributor_active, setIs_distributor_active] = useState("");

  // Delivery fields
  const [id, setId] = useState("");
  const [active, setActive] = useState("");
  const [email, setEmail] = useState("");
  const [license_number, setLicense_number] = useState("");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [registered_at, setRegistered_at] = useState("");
  const [vehicle_number, setVehicle_number] = useState("");
  const [vehicle_type, setVehicle_type] = useState("");

  const handleSignup = () => {
    if (userType === "Distributor") {
    } else {
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="user-type">
          <label>
            <input
              type="radio"
              name="userType"
              value="Distributor"
              checked={userType === "Distributor"}
              onChange={() => setUserType("Distributor")}
            />
            Distributor
          </label>
          <label>
            <input
              type="radio"
              name="userType"
              value="Delivery"
              checked={userType === "Delivery"}
              onChange={() => setUserType("Delivery")}
            />
            Delivery
          </label>
        </div>

        <form className="grid-container" onSubmit={(e) => e.preventDefault()}>
          {userType === "Distributor" ? (
            <>
              <input type="text" placeholder="Shop Name" onChange={(e) => setDistributor_shop_name(e.target.value)} />
              <input type="text" placeholder="Username" onChange={(e) => setDistributor_user_name(e.target.value)} />
              <input type="email" placeholder="Email" onChange={(e) => setDistributor_email(e.target.value)} />
              <input type="password" placeholder="Password" onChange={(e) => setDistributor_password_hash(e.target.value)} />
              <input type="text" placeholder="Contact Number" onChange={(e) => setDistributor_contact_number(e.target.value)} />
              <input type="text" placeholder="Address" onChange={(e) => setDistributor_address(e.target.value)} />
              <input type="text" placeholder="City" onChange={(e) => setDistributor_city(e.target.value)} />
              <input type="text" placeholder="State" onChange={(e) => setDistributor_state(e.target.value)} />
              <input type="text" placeholder="Pin Code" onChange={(e) => setDistributor_pin_code(e.target.value)} />
              <input type="text" placeholder="GSTIN Number" onChange={(e) => setGstin_number(e.target.value)} />
            </>
          ) : (
            <>
              <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
              <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
              <input type="text" placeholder="Mobile" onChange={(e) => setMobile(e.target.value)} />
              <input type="text" placeholder="License Number" onChange={(e) => setLicense_number(e.target.value)} />
              <input type="text" placeholder="Vehicle Number" onChange={(e) => setVehicle_number(e.target.value)} />
              <input type="text" placeholder="Vehicle Type" onChange={(e) => setVehicle_type(e.target.value)} />
            </>
          )}          
        </form> 

      </div>

    </div>
  );
};

export default UserSignUp;
