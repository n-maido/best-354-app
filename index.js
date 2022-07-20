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

async function getTableData(tableName) {
  try {
    const result = await pool.query(`SELECT * FROM ${tableName}`);
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

    // relations.push({ name: "Blood Tested", data: await getTableData("testblood") }); //missing

    relations.push({ name: "Donations (Donors)", data: await getTableData("donate_donor") });

    relations.push({ name: "Donations (Blood)", data: await getTableData("donate_blood") });

    relations.push({ name: "Blood Transported From Blood Drive to Blood Bank", data: await getTableData("transporttobloodbank") });

    relations.push({ name: "Blood Transported From Blood Bank to Hospital", data: await getTableData("transporttohospital") });

    // relations.push({ name: "Blood Disposed", data: await getTableData("disposeblood") }); //missing

    // relations.push({ name: "Transfusions", data: await getTableData("transfusion") }); //missing

    relations.push({ name: "Volunteers", data: await getTableData("volunteer") });

    relations.push({ name: "Donors", data: await getTableData("donor") });

    relations.push({ name: "Donor Contact", data: await getTableData("donor_contact") });

    relations.push({ name: "Recipients", data: await getTableData("recipient") });

    relations.push({ name: "Conducted Questionnaires", data: await getTableData("conduct_questionnaire") });

    console.log(relations.length)

    const data = {relations: relations}
    res.render('pages/index', data)

  } catch (error) {
    res.send(error)
  }
  
})

// individual table page
app.get('/Blood-Banks', async (req, res) => {
  try {
    const data = { name: "Blood Banks", data: await getTableData("blood_bank") }
    res.render('pages/table', data)
  } catch (error) {
    res.send(error)
  }
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
