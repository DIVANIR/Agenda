const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

const divsDays = document.querySelectorAll(".days div")
const next = document.querySelector(".next")
const previous = document.querySelector(".previous")
const infoMonth = document.querySelector(".month")
const modal = document.querySelector(".modal")
const saveWork = document.querySelector(".modalAdd input[type='button']")

const works = {}



const year = new Date().getFullYear()
const date = new Date()
let selectedMonth = date.getMonth()
let selectedYear = date.getFullYear()
let holidays 

const getHolidays = async ()=>{
    
    const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`)
   
    return await response.json()
 
}

(async ()=>{
    holidays = await getHolidays()
    setHolidays()
    
})//()


const setHolidays = ()=>{
    if(holidays)
    for(const holiday of holidays){        
        const divDay = document.querySelector(`[data-date='${holiday.date}']`)
        if(divDay){
            divDay.classList.add("holiday")
            divDay.innerHTML = divDay.innerHTML + " - " + holiday.name
        }
    }
}


const show = (e)=>{
    const dateString = e.parentElement.dataset.date
    modal.style.display = "flex"
modal.children[0].children[0].date.value = dateString

}


const loadMonth = ()=>{
    date.setDate(1)
    infoMonth.innerHTML = `${meses[selectedMonth]} de ${date.getFullYear()}`
    for(let i = 0; i < 42; i++){
        if(i==0){
            const day = date.getDay()
            if(i < day){
                date.setDate(date.getDate()-day)
            }
        }
        
        divsDays[i].innerHTML = `${date.getDate()}<span onclick="show(this)">+</span>`
        const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate()
        const month = date.getMonth() > 9 ? date.getMonth() +1 : "0"+(date.getMonth()+1)



        divsDays[i].dataset.date = `${date.getFullYear()}-${month}-${day}`
        
        divsDays[i].classList.remove("without")
        divsDays[i].classList.remove("holiday")        
        divsDays[i].classList.remove("full")
        if(selectedMonth!=date.getMonth()){
            divsDays[i].classList.add("without")
        }else if(date.getDay()==0){
            divsDays[i].classList.add("holiday")
        }else if(date.getDate()<15){
            divsDays[i].classList.add("full")
        }
        date.setDate(date.getDate()+1)
    }

    setHolidays()
}
loadMonth()

next.addEventListener("click", ()=>{
    date.setFullYear(selectedYear)
    date.setMonth(selectedMonth+1)
    date.setDate(1)
    selectedMonth = date.getMonth()
    selectedYear = date.getFullYear()
    loadMonth()
})

previous.addEventListener("click", ()=>{
    date.setFullYear(selectedYear)
    date.setMonth(selectedMonth-1)
    date.setDate(1)
    selectedMonth = date.getMonth()
    selectedYear = date.getFullYear()
    loadMonth()
})

saveWork.addEventListener("click", (event)=>{
    const form = event.target.parentElement
    const team = form.team.value
    const client = form.client.value
    const service = form.service.value
    const address = form.address.value
    
    works[form.date.value] = works[form.date.value] || {}
    works[form.date.value][team] = {
                client,
                service,
                address,
                status:"Não iniciada"
            }
        
    
    console.log(works)
})

const saveFile = (content, file)=>{

}

const readFile = ()=>{
    fetch("agenda.txt")
    .then(e=>{
        console.log(e)
    })
    .catch(e=>{
        console.log(e)
    })
    .finally(e=>{
        console.log(e)
    })

    
}

readFile()

  




