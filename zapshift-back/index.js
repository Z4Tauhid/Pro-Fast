const express = require('express')
const cors = require('cors')
const { ObjectId } = require('mongodb');
const admin = require("firebase-admin");

const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const stripe =require('stripe')(process.env.PAYMENT_GATEWAY_KEY)

const app = express()
const port = process.env.PORT || 3000



app.use(cors())
app.use(express.json())


const decodedKey = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf8')
const serviceAccount = JSON.parse(decodedKey)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bddpnhc.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const parcelDataCollection = client.db('parcelDataDB').collection('parcelCollection')
    const paymentCollection = client.db('parcelDataDB').collection('paymentCollection')
    const userCollection = client.db('parcelDataDB').collection('userCollection')
    const ridersCollection = client.db('parcelDataDB').collection('ridersCollection')


    //  Tracking Logger Helper
const trackingLogger = async (parcelId, status, message, updatedBy = "") => {
  await parcelDataCollection.updateOne(
    { _id: new ObjectId(parcelId) },
    {
      $set: { delivery_status: status },
      $push: {
        trackingLogs: {
          status,
          message,
          updatedBy,
          time: new Date(),
        },
      },
    }
  );
};


    // Custom Middlewares

    const verifyToken = async (req, res, next) =>{
      

      const authHeaders = req.headers.authorization

      if (!authHeaders) {
        return res.status(401).send({message: "Unauthorize Access"})
      }

      const token = authHeaders.split(' ')[1]

      if (!token) {
        return res.status(401).send({message: "Unauthorize Access"})
      }

      // Verify The Token

       try {
             const decoded = await admin.auth().verifyIdToken(token)
             req.decoded = decoded

             next()
       }
       catch(error){
        return res.status(403).send({message: "Unauthorize Access"})
       }

      
    }

    const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.decoded.email;

    const user = await userCollection.findOne({ email });

    if (!user || user.role !== "admin") {
      return res.status(403).send({ message: "Forbidden: Admin only" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Admin verification failed" });
  }
};

//Verify Rider
    const verifyRider = async (req, res, next) => {
  try {
    const email = req.decoded.email;

    const user = await userCollection.findOne({ email });

    if (!user || user.role !== "rider") {
      return res.status(403).send({ message: "Forbidden: Admin only" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Admin verification failed" });
  }
};


  app.get('/myParcels', verifyToken, async(req,res) => {
  try {
    const userEmail = req.query.userEmail;

    if (req.decoded.email !== userEmail) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    const query = userEmail ? { createdBy: userEmail } : {};
    const options = { sort: { creation_date: -1 } };

    const myParcels = await parcelDataCollection.find(query, options).toArray();
    res.send(myParcels);

  } catch(error) {
    console.log(error);
    res.status(500).send({ message: "Failed to load parcels" });
  }
});




    // Get a specific parcel by ID



     app.get('/payParcels/:id', verifyToken, async(req,res) => {

      

      try{

        

        const id = req.params.id

        console.log(id)

        const parcel = await parcelDataCollection.findOne({_id: new ObjectId(id)})
        
        res.send(parcel)


      } catch(error) {
        console.log(error)
      }
    })

    // Get Paid parcel by a user-email

    app.get('/payments', verifyToken, async (req, res) => {
  try {
    
    const email = req.query.email;

    if(req.decoded.email!==email){
      return res.status(403).send({message: "Unauthorize Access"})
    }

    const query = email ? { email } : {};

    const payments = await paymentCollection
      .find(query)
      .sort({ paidAt: -1 }) //  latest first
      .toArray();

    res.send(payments);

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to load payment history' });
  }
});




 app.post('/parcels', async (req, res) => {
  try {
    const newParcel = {
      ...req.body,
      payment_status: "pending",
      delivery_status: "Not_Collected",
      creation_date: new Date().toISOString(),
      trackingLogs: [],
    };

    const result = await parcelDataCollection.insertOne(newParcel);

    //  tracking log
    await trackingLogger(result.insertedId, "Not_Collected", "Parcel created");

    res.status(201).send(result);
  } catch (error) {
    console.log(error);
  }
});



//Store userData when they are first time registering 

app.post('/users', async(req, res) =>{

        try{

            const email = req.body.email
            const userExistOrNot = await userCollection.findOne({email})

            if(userExistOrNot) {
              return res.status(200).send({message: "User Already Exists!!"})
            }

            const user = req.body

            const result =await userCollection.insertOne(user)
            res.send(result)
            
        } catch (error) {
            console.log(error)
        }


})

app.post('/create-payment-intent', async(req, res) => {
  
  const amountInCents = req.body.amountInCents

  try{
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      payment_method_types: ['card']

    })

    res.json({clientSecret: paymentIntent.client_secret})

  } catch(error) {
    res.status(500).json({error: error.message})
    
    
    
  }
})


//Store Rider Data in Rider Collection

app.post("/riders", async (req, res) => {
  try {
    const rider = {
      ...req.body,
      status: "pending",
      workStatus: "none",
      applied_at: new Date().toISOString(),
    };

    if (!rider?.name || !rider?.age || !rider?.region || !rider?.district) {
      return res.status(400).send({
        success: false,
        message: "Missing required rider information",
      });
    }

    const existingRider = await ridersCollection.findOne({ email: rider.email });

    if (existingRider) {
      return res.status(409).send({
        success: false,
        message: "You have already applied as a rider",
      });
    }

    const result = await ridersCollection.insertOne(rider);

    res.status(201).send({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating rider:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
});



//Get Pending Rider Data from Rider Collection

app.get("/pending", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const pendingRiders = await ridersCollection
      .find({ status: "pending" })
      .toArray();

    res.send(pendingRiders);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch pending riders" });
  }
});
//Get Active Rider Data from Rider Collection

app.get("/active", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const pendingRiders = await ridersCollection
      .find({ status: "active" })
      .toArray();

    res.send(pendingRiders);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch pending riders" });
  }
});


// Get All User for dashboard Admin 

app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await userCollection.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to load users" });
  }
});


// Get parcels for assign rider (paid but not collected)
app.patch("/assign-rider/:parcelId", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { parcelId } = req.params;
    const { riderId, riderEmail, riderName } = req.body;

    if (!riderId || !riderEmail || !riderName) {
      return res.status(400).send({ message: "Rider info required" });
    }

    //  Update parcel with rider info
    await parcelDataCollection.updateOne(
      { _id: new ObjectId(parcelId) },
      {
        $set: {
          assignedRider: {
            riderId,
            riderName,
            riderEmail,
          },
        },
      }
    );

    //  Log tracking
    await trackingLogger(
      parcelId,
      "Assigned To Rider",
      `Assigned to ${riderName}`,
      req.decoded.email
    );

    //  Update rider work status
    await ridersCollection.updateOne(
      { _id: new ObjectId(riderId) },
      {
        $set: { workStatus: "engaged" },
      }
    );

    res.send({ success: true });
  } catch (error) {
    console.error("Assign rider failed:", error);
    res.status(500).send({ message: "Failed to assign rider" });
  }
});


  // Get parcels for assign rider (paid + not yet assigned)
app.get("/assign-parcels", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const query = {
      payment_status: "paid",
      delivery_status: { $in: ["Not_Collected", "In transit"] },
    };

    const parcels = await parcelDataCollection
      .find(query)
      .sort({ creation_date: -1 })
      .toArray();

    res.send(parcels);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to load assign parcels" });
  }
});



// Get available riders for assignment
app.get("/available-riders", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const riders = await ridersCollection.find({
      status: "active",
      workStatus: "none",
    }).toArray();

    res.send(riders);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to load available riders" });
  }
});

// get parcel info assigned to a rider

app.get("/rider/parcels", verifyToken, verifyRider, async (req, res) => {
  try {
    const riderEmail = req.query.email;

    if (req.decoded.email !== riderEmail) {
      return res.status(403).send([]);
    }

    const parcels = await parcelDataCollection
      .find({
        "assignedRider.riderEmail": riderEmail,
        payment_status: "paid", //  THIS IS ISSUE 3 FIX
      })
      .sort({ creation_date: -1 })
      .toArray();

    res.send(parcels);
  } catch (error) {
    console.error("Failed to load rider parcels:", error);
    res.status(500).send([]);
  }
});


//  Get completed deliveries for rider
app.get("/rider/completed", verifyToken, verifyRider, async (req, res) => {
  try {
    const riderEmail = req.query.email;

    if (req.decoded.email !== riderEmail) {
      return res.status(403).send([]);
    }

    const parcels = await parcelDataCollection
      .find({
        "assignedRider.riderEmail": riderEmail,
        delivery_status: "Completed",
        payment_status: "paid",
      })
      .sort({ creation_date: -1 })
      .toArray();

    res.send(parcels);
  } catch (error) {
    console.error("Failed to load completed deliveries:", error);
    res.status(500).send([]);
  }
});










// check user role and Get user role (email from body)

app.post("/users/role", verifyToken, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }

    // security check
    if (req.decoded.email !== email) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    const user = await userCollection.findOne({ email });

    if (!user) {
      return res.send({ role: "guest" });
    }

    res.send({ role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to get role" });
  }
});

// Pick Delivery API

// Rider picks a parcel (Out For Delivery)
app.patch("/rider/pick/:id", verifyToken, verifyRider, async (req, res) => {
  try {
    const { id } = req.params;
    const riderEmail = req.decoded.email;

    const parcel = await parcelDataCollection.findOne({ _id: new ObjectId(id) });

    if (!parcel) return res.status(404).send({ message: "Parcel not found" });

    if (parcel.assignedRider?.riderEmail !== riderEmail) {
      return res.status(403).send({ message: "Forbidden" });
    }

    //  Use trackingLogger instead of direct update
    await trackingLogger(id, "Out For Delivery", "Parcel picked by rider", riderEmail);

    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Pick failed" });
  }
});


// Delivered API

// Rider marks parcel as delivered
app.patch("/rider/delivered/:id", verifyToken, verifyRider, async (req, res) => {
  try {
    const { id } = req.params;
    const riderEmail = req.decoded.email;

    const parcel = await parcelDataCollection.findOne({ _id: new ObjectId(id) });

    if (!parcel) return res.status(404).send({ message: "Parcel not found" });

    if (parcel.assignedRider?.riderEmail !== riderEmail) {
      return res.status(403).send({ message: "Forbidden" });
    }

    if (parcel.delivery_status !== "Out For Delivery") {
      return res.status(400).send({ message: "Parcel must be picked first" });
    }

    //  Add tracking log
    await trackingLogger(id, "Completed", "Parcel delivered", riderEmail);

    //  Update paidToRider and completedAt separately
    await parcelDataCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { paidToRider: false, completedAt: new Date() } }
    );

    // Update rider work status
    await ridersCollection.updateOne(
      { email: riderEmail },
      { $set: { workStatus: "none" } }
    );

    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Delivery failed" });
  }
});



//  Rider Cashout API
app.patch("/rider/cashout", verifyToken, verifyRider, async (req, res) => {
  try {
    const riderEmail = req.decoded.email;

    const result = await parcelDataCollection.updateMany(
      {
        "assignedRider.riderEmail": riderEmail,
        delivery_status: "Completed",
        paidToRider: { $ne: true },
      },
      {
        $set: {
          paidToRider: true,
          cashedOutAt: new Date(),
        },
      }
    );

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Cashout failed" });
  }
});





// Make/Patch Admin API

app.patch("/users/admin/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;

    const result = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role: "admin" } }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to make admin" });
  }
});

// Remove/Patch Admin API

app.patch("/users/remove-admin/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;

    const result = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role: "user" } }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to remove admin" });
  }
});





//Patch rider status pending, accepted, rejected

app.patch("/riders/:id", verifyToken, verifyAdmin,async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { email } = req.body;
    console.log(email)

    if (!status) {
      return res.status(400).send({ message: "Status is required" });
    }

    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: { status },
    };

    

    const result = await ridersCollection.updateOne(filter, updateDoc);

    //update user role once rider is being activated

    if(status==='active'){

      const useeQuerry = {email}
      const userUpdateDoc= {
        $set: {
          role: 'rider'
        }
      }

      const roleResult = await userCollection.updateOne(useeQuerry, userUpdateDoc)

    }

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to update rider" });
  }
});




app.post('/payments', async (req, res) => {
  try {
    const payment = req.body;

    //  Save payment info
    const paymentResult = await paymentCollection.insertOne({
      parcelId: new ObjectId(payment.parcelId),
      email: payment.email,
      amount: payment.amount,
      currency: payment.currency,
      transactionId: payment.transactionId,
      paymentIntentId: payment.paymentIntentId,
      paymentMethod: payment.paymentMethod,
      status: 'paid',
      paidAt: new Date().toISOString()
    });

    // 2️⃣ Update parcel payment status
    await parcelDataCollection.updateOne(
      { _id: new ObjectId(payment.parcelId) },
      { $set: { payment_status: 'paid' } }
    );

    // Add tracking log for payment
    await trackingLogger(payment.parcelId, "Paid", "Payment completed", payment.email);

    res.send({
      success: true,
      paymentResult
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Payment saving failed' });
  }
});



app.post("tracking", async(req,res) => {
  const {tracking_id, parcel_id, status, message, updated_by=''} = req.body
  const log ={
    tracking_id,
    parcel_id: parcel_id ? new ObjectId(parcel_id) : undefined,
    status,
    message,
    time: new Date()

  }
})

//  Track Parcel API by Tracking ID
app.get("/parcel/track/:trackingId", async (req, res) => {
  try {
    const trackingId = req.params.trackingId;

    const parcel = await parcelDataCollection.findOne({
      tracking_ID: trackingId,
    });

    if (!parcel) return res.status(404).send({ message: "Parcel not found" });

    res.send(parcel);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Tracking failed" });
  }
});

// Admin Stat API

app.get("/admin/stats", verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Total Income
    const incomeAgg = await paymentCollection.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
    ]).toArray();

    // Total Parcel Cost
    const parcelCostAgg = await parcelDataCollection.aggregate([
      { $group: { _id: null, totalCost: { $sum: "$cost" } } }
    ]).toArray();

    // Total Users
    const totalUsers = await userCollection.countDocuments();

    // Total Riders
    const totalRiders = await ridersCollection.countDocuments();

    // Delivered Parcels
    const deliveredAgg = await parcelDataCollection.aggregate([
      { $match: { delivery_status: "Completed" } },
      { $count: "totalDelivered" }
    ]).toArray();

    //  Active Riders
    const activeRiders = await ridersCollection.countDocuments({ status: "active" });

    //  Parcels In Transit
    const transitAgg = await parcelDataCollection.aggregate([
      { $match: { delivery_status: { $in: ["In transit", "Picked"] } } },
      { $count: "totalTransit" }
    ]).toArray();

    //  Top Rider
    const topRiderAgg = await parcelDataCollection.aggregate([
      { $match: { delivery_status: "Completed" } },
      {
        $group: {
          _id: "$assignedRider.riderEmail",
          delivered: { $sum: 1 }
        }
      },
      { $sort: { delivered: -1 } },
      { $limit: 1 }
    ]).toArray();

    res.send({
      totalIncome: incomeAgg[0]?.totalIncome || 0,
      totalCost: parcelCostAgg[0]?.totalCost || 0,
      totalUsers,
      totalRiders,
      deliveredParcels: deliveredAgg[0]?.totalDelivered || 0,
      activeRiders,
      inTransit: transitAgg[0]?.totalTransit || 0,
      topRider: topRiderAgg[0] || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Admin stats failed" });
  }
});

// Chart API

app.get("/admin/revenue-chart", verifyToken, verifyAdmin, async (req, res) => {
  const result = await paymentCollection.aggregate([
    {
      $group: {
        _id: { $substr: ["$paidAt", 0, 10] },
        total: { $sum: "$amount" }
      }
    },
    { $sort: { _id: 1 } }
  ]).toArray();

  res.send(result);
});

// Parcel Status API

app.get("/admin/parcel-status-chart", verifyToken, verifyAdmin, async (req, res) => {
  const result = await parcelDataCollection.aggregate([
    {
      $group: {
        _id: "$delivery_status",
        total: { $sum: 1 }
      }
    }
  ]).toArray();

  res.send(result);
});








app.delete('/dltparcels/:id', async(req, res) => {
  try{

    const id = req.params.id

    const result = await parcelDataCollection.deleteOne({_id: new ObjectId(id)})

    res.send(result)

  } catch(error) {
        console.log(error)
      }
})

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})