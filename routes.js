const express = require('express');
const router = express.Router();
const Company = require('./models/company');
const twelvedata = require("./TwelveData")
const comp_logo = require("./Company_Logo")

router.use(function(req, res, next){
  res.locals.message = req.flash();
  next();
});
   

// render company_add
router.get("/company_add", (req, res) => {
  res.render("company_add")

})

// display list of companies
router.get("/company", async (req, res) => {
  const companies = await Company.find({ name: { $exists: true } });

  var list = []
  for (let i = 0; i < companies.length; i++) {
    list.push(companies[i].name) 
  } 

  res.render("company", {

    list: list,
    companies: companies
  })

})

// display single company information by TICKER
router.get("/company/:ticker", async (req, res) => {
  try {
  const company = await Company.findOne({ ticker: req.params.ticker })
     
  const company_name = company.name
  const ticker_symbol = company.ticker
  const company_PE = company.PE
  const stock_price = await twelvedata.getPrice([ticker_symbol])
  const company_logo = await comp_logo.showLogo(ticker_symbol)
  const company_dividend = company.dividend



  res.render("company_single", {
    name_company: company_name,
    name_ticker: ticker_symbol,
    stock_price: stock_price.price,
    PE: company_PE,
    dividend: company_dividend,
    logo: company_logo
   })

  } catch (error) {
    res.send(error)
  }
})


// post form for companies, ADD company to database
router.post("/", async (req, res) => {
  const company = new Company({
    name: req.body.name_company,
    ticker: req.body.name_ticker,
    PE: req.body.pe,
    dividend: req.body.dividend
  });

const check_duplicate = await Company.find({ $or: [{name: company.name}, {ticker: company.ticker}] })

console.log(check_duplicate)

if(check_duplicate.length === 0){
  console.log("duplicate check is empty, company not found in db")
  console.log("Adding company to db!")

  try {
    const newCompany = await company.save();
    const state = JSON.stringify({ newCompany });
    req.flash('success', 'Successfully added company to database' + state);
    res.redirect('/company_add');

  } catch(err) {
    //return res.status(500).json({ message: err.message });
    const err_msg = JSON.stringify(err.message)

    req.flash('success', 'Error ' + err_msg);
    res.redirect('/company_add');
  }


} else if (check_duplicate.length != 0) {
  console.log("company found in database, request denied:")
  req.flash('success', 'company found in database, request denied');
  res.redirect('/company_add');
  //res.status(403).send("company found in database, request denied")
}

})
 
// render company_del
router.get("/company_del", (req, res) => {
  res.render("company_del")

})

// Delete company by name
router.delete("/company_del", async (req, res) => {

  await Company.deleteOne({$or: [{name: req.body.name_ticker2}, {ticker: req.body.name_ticker2} ]}, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    else {
      //res.status(200).json(result);
      const result_success = JSON.stringify(result)
      req.flash('success', 'Successfully deleted company ' + req.body.name_ticker2 + ' from database' + result_success);
      res.redirect('/company');
    }
  }).clone().catch(function(err){ console.log(err)});
})
 
// render company_upd
router.get("/company_upd", async (req, res) => {
  const companies = await Company.find({ name: { $exists: true } });

  var list = []
  for (let i = 0; i < companies.length; i++) {
  
    list.push(companies[i].name) 
  } 

  res.render("company_update", {
    list: list,
   companies: companies
  })

})
 
// Update company by ticker
router.put("/company_upd", async (req, res) => {

  const upd_company_name = req.body.name_company
  const upd_ticker_name = req.body.name_ticker
  const upd_PE = req.body.PE
  const upd_dividend = req.body.dividend

  await Company.findOneAndUpdate({ ticker: upd_ticker_name }, {name: upd_company_name, PE: upd_PE, dividend: upd_dividend}, {new: true}, (err, result) => { 
    if (err){ 
      return res.status(500).json({ message: err.message });
    } 
    else{
      //res.status(200).json({ result });
      const result_success = JSON.stringify(result)
      req.flash('success', 'Successfully updated company ' + upd_ticker_name + ' in database' + result_success);
      res.redirect('/company/' + upd_ticker_name);
    }
  }).clone().catch(function(err){ console.log(err)}); 
})


module.exports = router;