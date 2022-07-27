const { table } = require('console')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express()

// connect to db
const { Pool } = require('pg')
const config = {
  // db name is bbdb
  connectionString: process.env.DATABASE_URL || "postgres://postgres:root@localhost/bbdb"
}

// if we're connected to the db on heroku, add this ssl setting
if (config.connectionString === process.env.DATABASE_URL) {
  config.ssl = { rejectUnauthorized: false };
}

var pool = new Pool(config)

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended:false}))

async function getTableData(tableName) {
  try {
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    return result.rows
  } catch (error) {
    res.send(error)
  }
}

//NESTED AGGREGATION WITH GROUP-BY
async function getNestedData(tableName, bloodstatus) {
  try {
    var nestedQuery = `select bloodtype, sum(quantity) from blood_bag where 
    bloodstatus='${bloodstatus}' group by bloodtype;`
    const result = await pool.query(nestedQuery);
    return result.rows
  } catch (error) {
    res.send(error)
  }
}

//JOIN QUERY
async function getJoinData() {
  try {
    var joinQuery = `Select transporttobloodbank.bloodid, driveid, instno, transporttobloodbank.time as "Blood Bank Delivery Time", bankinstno, 
    hospitalinstno, transporttohospital.time as "Hospital Delivery Time" from transporttobloodbank inner join transporttohospital on 
    transporttobloodbank.bloodid = transporttohospital.bloodid;`
    const result = await pool.query(joinQuery);
    return result.rows
  } catch (error) {
    res.send(error)
  }
}

async function getDivisionData() {
  try {
    var divisionQuery = `SELECT * FROM Volunteer WHERE name not in 
    (SELECT name FROM ((SELECT name, vID FROM (SELECT vID Conduct_Questionnaire) 
    AS p CROSS JOIN (SELECT DISTINCT name FROM Volunteer) AS sp) EXCEPT 
    (SELECT name, vID FROM Volunteer)) AS r);`
    const result = await pool.query(divisionQuery);
    return result.rows
  } catch (error) {
    res.send(error)
  }
}

// SELECT QUERY
async function getSelectData(field, value) {
  try {
    const result = await pool.query(`SELECT * FROM donor_contact WHERE ${field}='${value}'`);
    return result.rows
  } catch (error) {
    res.send(error)
  }
}

// PROJECT QUERY
async function getProjectData(cols) {
  try {
    const result = await pool.query(`SELECT ${cols} FROM donor_contact`);
    return result.rows
  } catch (error) {
    res.send(error)
  }
}

// AGGREGATION QUERY
async function getAggData(agg) {
  try {
    const result = await pool.query(`SELECT * FROM donate_blood WHERE time=(SELECT ${agg}(time) FROM donate_blood)`);
    return result.rows
  } catch (error) {
    res.send(error)
  }
}


// GET
// main page
app.get('/', async (req, res) => {
  var relations = [];
  
  try {
    relations.push({ name: "Blood Banks", data: await getTableData("blood_bank") });
    
    relations.push({ name: "Blood Drives", data: await getTableData("blood_drive") });
    
    relations.push({ name: "Hospitals", data: await getTableData("hospital") });

    relations.push({ name: "Phlebotomists", data: await getTableData("phlebotomist") });

    relations.push({ name: "Blood Bags", data: await getTableData("blood_bag") });

    relations.push({ name: "Red Blood Cells", data: await getTableData("red_blood_cells") });

    relations.push({ name: "Plasma", data: await getTableData("plasma") });

    relations.push({ name: "Platelets", data: await getTableData("platelets") });

    relations.push({ name: "Blood Tested", data: await getTableData("testblood") }); //

    relations.push({ name: "Donations-Donors", data: await getTableData("donate_donor") });

    relations.push({ name: "Donations-Blood", data: await getTableData("donate_blood") });

    relations.push({ name: "Blood Transported From Blood Drive to Blood Bank", data: await getTableData("transporttobloodbank") });

    relations.push({ name: "Blood Transported From Blood Bank to Hospital", data: await getTableData("transporttohospital") });

    relations.push({ name: "Blood Disposed", data: await getTableData("disposeblood") }); //

    relations.push({ name: "Transfusions", data: await getTableData("transfusion") }); //

    relations.push({ name: "Volunteers", data: await getTableData("volunteer") });

    relations.push({ name: "Donors", data: await getTableData("donor") });

    relations.push({ name: "Donor Contact", data: await getTableData("donor_contact") });

    relations.push({ name: "Recipients", data: await getTableData("recipient") });

    relations.push({ name: "Conducted Questionnaires", data: await getTableData("conduct_questionnaire") });


    const data = {relations: relations}
    res.render('pages/index', data)

  } catch (error) {
    res.send(error)
  }
  
})

// individual table pages
app.get('/Blood-Banks', async (req, res) => {
  try {
    const data = { name: "Blood Banks", data: await getTableData("blood_bank") }
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/Blood-Drives', async (req, res) => {
  try {
    const data = { name: "Blood Drives", data: await getTableData("blood_drive") }
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/Hospitals', async (req, res) => {
  try {
    const data ={ name: "Hospitals", data: await getTableData("hospital") }
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/Phlebotomists', async (req, res) => {
  try {
    const data = { name: "Phlebotomists", data: await getTableData("phlebotomist") }
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/Blood-Bags', async (req, res) => {
  try {
    const data = { name: "Blood Bags", data: await getTableData("blood_bag") }
    res.render('pages/bloodbags', data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/Red-Blood-Cells', async (req, res) => {
  try {
    const data = { name: "Red Blood Cells", data: await getTableData("red_blood_cells") }
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/Plasma', async (req, res) => {
  try {
    const data = { name: "Plasma", data: await getTableData("plasma") }
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/Platelets', async (req, res) => {
  try {
    const data = { name: "Platelets", data: await getTableData("platelets") }
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

 app.get('/Blood-Tested', async (req, res) => {
   try {
     const data = { name: "Blood Tested", data: await getTableData("testblood") }
     res.render('pages/table', data)
   } catch (error) {
     res.send(error)
   }
 })

app.get('/Donations-Donors', async (req, res) => {
  try {
    const data = { name: "Donations-Donors", data: await getTableData("donate_donor") }
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/Donations-Blood', async (req, res) => {
  try {
    const data = { name: "Donations-Blood", data: await getTableData("donate_blood") }
    res.render('pages/donate_blood', data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/Blood-Transported-From-Blood-Drive-to-Blood-Bank', async (req, res) => {
  try {
    const data = { name: "Blood Transported From Blood Drive to Blood Bank", data: await getTableData("transporttobloodbank") }
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/Blood-Transported-From-Blood-Bank-to-Hospital', async (req, res) => {
  try {
    const data = { name: "Blood Transported From Blood Bank to Hospital", data: await getTableData("transporttohospital") }
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

 app.get('/Blood-Disposed', async (req, res) => {
   try {
     const data = { name: "Blood Disposed", data: await getTableData("disposeblood") }
     res.render('pages/table', data)
   } catch (error) {
     res.send(error)
   }
 })

 app.get('/Transfusions', async (req, res) => {
   try {
     const data = { name: "Transfusions", data: await getTableData("transfusion") }
     res.render('pages/table', data)
   } catch (error) {
     res.send(error)
   }
 })

app.get('/Volunteers', async (req, res) => {
  try {
    const data = { name: "Volunteers", data: await getTableData("volunteer") }
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/Donors', async (req, res) => {
  try {
    const data = { name: "Donors", data: await getTableData("donor") }
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/Donor-Contact', async (req, res) => {
  try {
    const data = { name: "Donor Contact", data: await getTableData("donor_contact") }
    res.render('pages/donor_contact', data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/Recipients', async (req, res) => {
  try {
    const data = { name: "Recipients", data: await getTableData("recipient") }
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/Conducted-Questionnaires', async (req, res) => {
  try {
    const data = { name: "Conducted Questionnaires", data: await getTableData("conduct_questionnaire") }
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})


//NESTED "GROUP BY" QUERY - MISHA 
//Query: Display quantitiy of blood by bloodtype
app.get('/Nested:BloodStatus', async (req, res) => {
  try {
    const data = { name: `Blood Bags: ${req.params.BloodStatus}`, data: await getNestedData("conduct_questionnaire", req.params.BloodStatus) }
    res.render('pages/bloodbags', data)
  } catch (error) {
    res.send(error)
  }
})

//JOIN QUERY - MISHA
app.get('/Join', async (req, res) => {
  try {
    const data = { name: `Blood Bags Transported History`, data: await getJoinData()}
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/Divide', async (req, res) => {
  try {
    const data = { name: `Divide Operator: Volunteer/Conduct_Questionnaire`, data: await getJoinData()}
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

// SELECT QUERY
// Query: Search for rows by a field value
// e.g. Search for rows where name="samantha"
app.post('/Select', async (req, res) => {
  let field = req.body.field;
  let value = req.body.value;
  try {
    const data = { name: `Search results for ${field} = ${value}`, data: await getSelectData(field, value)}
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

// PROJECT QUERY
// Query: Select which columns to display
app.post('/Project', async (req, res) => {
  // grab selected fields
  let body = JSON.parse(JSON.stringify(req.body)) // format: {'selection1': on, 'selection2': on}
  let cols = Object.keys(body).toString() // format: selection1, selection2
  console.log(cols);
  
  try {
    const data = { name: `Displaying columns: ${cols}`, data: await getProjectData(cols)}
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

// AGGREGATION QUERY
// Query: Find the oldest (min) or the most recent (max) donation time
app.post('/Aggregation', async (req, res) => {
  let agg = req.body.agg === "oldest" ? "min" : "max"
  try {
    const data = { name: `${req.body.agg} Donation`, data: await getAggData(agg)}
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))