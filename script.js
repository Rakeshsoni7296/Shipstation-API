"use strict";

const API_KEY = "74e7a187bc6f4f57b37f131d24e20332";
const API_SECRET = "eaf3f30ad0f7456a91d1e37d61329ddc";

const createShipment = document.getElementById("place-order");

const options = {
  method: "POST",
  headers: {
    Authorization: `Basic ${btoa(`${API_KEY}:${API_SECRET}`)}`,
    "Content-Type": "application/json",
  },
};

const placeOrder = async (orderDetails) => {
  options.body = JSON.stringify(orderDetails);
  const res = await fetch(
    "https://ssapi.shipstation.com/orders/createorder",
    options
  );
  if (!res.ok) throw new Error("Some Error Occurred!");
  const data = await res.json();
  return data;
};

const shipmentCreation = async (shipment) => {
  shipment.testLabel = true;
  shipment.shipDate = shipment.shipByDate;
  options.body = JSON.stringify(shipment);
  console.log(shipment);
  // return;
  const res = await fetch(
    "https://ssapi.shipstation.com/orders/createlabelfororder",
    options
  );
  // if (!res.ok) throw new Error(res.statusText);
  if (!res.ok) {
    // get the response text
    const text = await res.text();
    // log or display the text
    console.log(text);
    // throw an error with the text
    throw new Error(text);
  }
  const data = await res.json();
  console.log(data);
  return data;
};

const voidShipment = async (shipmentId) => {
  options.body = JSON.stringify({ shipmentId });
  const res = await fetch(
    "https://ssapi.shipstation.com/shipments/voidlabel",
    options
  );

  if (!res.ok) {
    // get the response text
    const text = await res.text();
    // log or display the text
    console.log(text);
    // throw an error with the text
    throw new Error(text);
  }
  const data = await res.json();
  console.log(data);
};

async function shipmentHandler() {
  // Get order Details
  const order = {
    orderNumber: "some_no",
    orderDate: new Date().toISOString(),
    shipByDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    orderStatus: "awaiting_shipment",
    customerEmail: "maheshkvestige@gmail.com",
    billTo: {
      name: "Mahesh Kumar",
      street1: null,
      city: null,
      state: null,
      postalCode: null,
      country: null,
      phone: null,
      residential: false,
    },
    shipTo: {
      name: "Mahesh Kumar",
      street1: "1600 Pennsylvania Ave",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "US",
      phone: "555-555-5555",
      residential: true,
    },
    customerNotes: "Please ship as soon as possible!",
    carrierCode: "gls_us",
    serviceCode: "gls_us_ground",
    packageCode: "gls_none",
    confirmation: "adult_signature",
    weight: {
      value: 125,
      units: "pounds",
    },
    advancedOptions: {
      containsAlcohol: true,
      saturdayDelivery: true,
    },
    testLabel: true,
  };

  // Create the order
  const shipment = await placeOrder(order);

  // Place the shipment
  const res = await shipmentCreation(shipment);

  await voidShipment(res.shipmentId);
}

// 24315322
const getPackageCode = async () => {
  options.method = "GET";
  const res = await fetch(
    "https://ssapi.shipstation.com/carriers/listpackages?carrierCode=gls_us",
    options
  );
  const data = await res.json();
  console.log(data);
};

const getServiceCode = async () => {
  options.method = "GET";
  const res = await fetch(
    "https://ssapi.shipstation.com/carriers/listservices?carrierCode=gls_us",
    options
  );
  const data = await res.json();
  console.log(data);
};

createShipment.addEventListener("click", async function () {
  await shipmentHandler();
  // await getPackageCode();
  // await getServiceCode();
});
