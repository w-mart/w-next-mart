import React, { useState } from "react";
import "../style.css"

const UserSignUp = () => {
  const [userType, setUserType] = useState("Distributor");
  const [message, setMessage] = useState("");

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

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
  const [deliveryFirstName, setDeliveryFirstName] = useState("");
  const [deliveryLastName, setDeliveryLastName] = useState("");
  const [deliveryPassword, setDeliveryPassword] = useState("");
  const [deliveryUsername, setDeliveryUsername] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    if (userType === "Distributor") {
      const data = {
        username: distributor_user_name,
        email: distributor_email,
        password: distributor_password_hash,
        firstName: firstName,
        lastName: lastName,
        phone: distributor_contact_number,
        role: "DISTRIBUTOR",
        gstinNumber: gstin_number,
        shopName: distributor_shop_name,
        address: distributor_address,
        city: distributor_city,
        state: distributor_state,
        pinCode: distributor_pin_code
      };
      try {
        const response = await fetch('http://localhost:8083/api/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*'
          },
          body: JSON.stringify(data)
        });
        if (response.ok) {
          setMessage("Signup successful!");
        } else {
          const error = await response.text();
          setMessage("Error: " + error);
        }
      } catch (err) {
        setMessage("Network error: " + err.message);
      }
    } else {
      const data = {
        username: deliveryUsername,
        email: email,
        password: deliveryPassword,
        firstName: deliveryFirstName,
        lastName: deliveryLastName,
        phone: mobile,
        role: "DELIVERY",
        gstinNumber: "",
        shopName: "",
        address: "",
        city: "",
        state: "",
        pinCode: ""
      };
      try {
        const response = await fetch('http://localhost:8083/api/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*'
          },
          body: JSON.stringify(data)
        });
        if (response.ok) {
          setMessage("Signup successful!");
        } else {
          const error = await response.text();
          setMessage("Error: " + error);
        }
      } catch (err) {
        setMessage("Network error: " + err.message);
      }
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

        <form className="grid-container" onSubmit={handleSignup}>
          {userType === "Distributor" ? (
            <>
              <input type="text" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} />
              <input type="text" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} />
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
              <button type="submit">Sign Up</button>
            </>
          ) : (
            <>
              <input type="text" placeholder="First Name" onChange={(e) => setDeliveryFirstName(e.target.value)} />
              <input type="text" placeholder="Last Name" onChange={(e) => setDeliveryLastName(e.target.value)} />
              <input type="text" placeholder="Username" onChange={(e) => setDeliveryUsername(e.target.value)} />
              <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" onChange={(e) => setDeliveryPassword(e.target.value)} />
              <input type="text" placeholder="Mobile" onChange={(e) => setMobile(e.target.value)} />
              <input type="text" placeholder="License Number" onChange={(e) => setLicense_number(e.target.value)} />
              <input type="text" placeholder="Vehicle Number" onChange={(e) => setVehicle_number(e.target.value)} />
              <input type="text" placeholder="Vehicle Type" onChange={(e) => setVehicle_type(e.target.value)} />
              <button type="submit">Sign Up</button>
            </>
          )}
        </form>
        {message && <p className="message">{message}</p>}

      </div>

    </div>
  );
};

export default UserSignUp;
