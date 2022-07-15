const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// var relations = ["Blood Banks", "Blood Drives", "Hospitals", "Volunteers", "Donors", "Recipients", "Phlebotomists", "Blood Bags"]
var relations = [
  { name: "Blood Banks" },
  { name: "Blood Drives" },
  { name: "Hospitals" },
  { name: "Volunteers" },
  { name: "Donors" },
  { name: "Donor Contact" },
  { name: "Recipients" },
  { name: "Phlebotomists" },
  { name: "Blood Bags" },
  { name: "Red Blood Cells" },
  { name: "Plasma" },
  { name: "Platelets" },
  { name: "Conducted Questionnaires" },
  { name: "Donations (Donors)" },
  { name: "Donations (Blood)" },
  { name: "Blood Transported From Blood Drive to Blood Bank" },
  { name: "Blood Transported From Blood Bank to Hospital" },
]

// GET
// main page
app.get('/', async (req, res) => {
  
  try {
    // get table data and append to relations
    const bloodBankDummy = [
      { instNo: 1, address: "3415 Okanagan, Armstrong, BC" },
      { instNo: 2, address: "3415 Okanagan, Armstrong, BC" },
      {instNo: 3, address: "3415 Okanagan, Armstrong, BC"}
    ]
    
    for (const item in relations) {
      relations[item].data = bloodBankDummy
    }

    console.log(relations)

    const data = {relations: relations}
    res.render('pages/index', data)
  } catch (error) {
    res.send(error)
  }
  
})


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
