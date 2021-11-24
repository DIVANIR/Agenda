const year = new Date().getFullYear()
let holidays

const getHolidays = async ()=>{
    
    const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`)
   
    return await response.json()
 
}

(async ()=>{
    holidays = await getHolidays()
    console.log(holidays)
})()

