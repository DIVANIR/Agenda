const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const divCalendar = document.querySelector(".calendar")
const divsDays = document.querySelectorAll(".days div")
const next = document.querySelector(".next")
const previous = document.querySelector(".previous")
const infoMonth = document.querySelector(".month")
const modal1 = document.querySelectorAll(".modal")[0]
const modal2 = document.querySelectorAll(".modal")[1]
const saveWork = document.querySelector(".modalAdd input[type='submit']")


const today = new Date()



var works = {}
var finish


const year = new Date().getFullYear()
const date = new Date()
let selectedMonth = date.getMonth()
let selectedYear = date.getFullYear()
let holidays = []

const getHolidays = async () => {

    const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`)

    return await response.json()

}

(async () => {
    holidays = await getHolidays()
    setHolidays()

})()


const setHolidays = () => {
    if (holidays)
        for (const holiday of holidays) {
            const divDay = document.querySelector(`[data-date='${holiday.date}']`)
            if (divDay) {
                divDay.classList.add("holiday")
                divDay.innerHTML = divDay.innerHTML + " - " + holiday.name
            }
        }
}


const show = (e) => {
    const dateString = e.parentElement.dataset.date
    modal1.style.display = "flex"
    modal1.children[0].children[0].date.value = dateString

}


const loadMonth = () => {
    date.setDate(1)
    infoMonth.innerHTML = `${meses[selectedMonth]} de ${date.getFullYear()}`
    for (let i = 0; i < 42; i++) {
        if (i == 0) {
            const day = date.getDay()
            if (i < day) {
                date.setDate(date.getDate() - day)
            }
        }

        divsDays[i].innerHTML = `${date.getDate()}<span onclick="show(this)">+</span>`
        const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate()
        const month = date.getMonth() > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)



        divsDays[i].dataset.date = `${date.getFullYear()}-${month}-${day}`

        divsDays[i].className = "day"
        if (selectedMonth != date.getMonth()) {
            divsDays[i].classList.add("without")
        } else if (date.getDay() == 0) {
            divsDays[i].classList.add("holiday")
        }

        if (date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()) {
            divsDays[i].classList.add("today")
        }



        date.setDate(date.getDate() + 1)



    }

    setHolidays()
}

const readFile = async () => {
    const result = await fetch("agenda.json")
    works = await result.json();
    for (const date in works) {


        for (const team in works[date]) {



            const dateStart = new Date(date)
            dateStart.setDate(dateStart.getDate() + 1)

            const dateEnd = new Date(works[date][team].finish)
            dateEnd.setDate(dateEnd.getDate() + 1)

            const timeDiff = Math.abs(dateEnd.getTime() - dateStart.getTime());
            const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

            let addDate = date
            const newAddDate = new Date(addDate)
            const currentDate = new Date()
            currentDate.setTime(newAddDate.getTime())
            let startHolidayOsSaturdayOrSunday = false
            for (let i = 0; i < diffDays; i++) {
                currentDate.setDate(newAddDate.getDate()+1)
                if(i==0){
                    startHolidayOsSaturdayOrSunday = currentDate.getDay()==0 || currentDate.getDay()==6
                }
                newAddDate.setDate(newAddDate.getDate()+1)
                const currentDay = currentDate.getDate() > 9 ? currentDate.getDate() : "0" + currentDate.getDate()
                const currentMonth = currentDate.getMonth() > 9 ? currentDate.getMonth() + 1 : "0" + (currentDate.getMonth() + 1)
                const dateString = `${currentDate.getFullYear()}-${currentMonth}-${currentDay}`
                let isHoliday = false
                for (const holiday of holidays) {
                    if (holiday.date == dateString) {
                        isHoliday = true
                        if(i==0){
                            startHolidayOsSaturdayOrSunday = true
                        }
                    }
                }
                const curentDayWeek = currentDate.getDay()
                if((curentDayWeek == 0 || curentDayWeek == 6 || isHoliday) && !startHolidayOsSaturdayOrSunday){                    
                    continue
                }
                
                
                
                const day = newAddDate.getDate() > 9 ? newAddDate.getDate() : "0" + newAddDate.getDate()
                const month = newAddDate.getMonth() > 9 ? newAddDate.getMonth() + 1 : "0" + (newAddDate.getMonth() + 1)
                addDate = `${newAddDate.getFullYear()}-${month}-${day}`

                const divDay = document.querySelector(`[data-date='${addDate}']`)
                const hasUl = divDay.querySelector("ul")
                const ul = hasUl ? hasUl : document.createElement("ul")
                const li = document.createElement("li")
                li.dataset.date = date
                li.dataset.team = team


                

                li.innerHTML = `<span class="close">x</span><strong>${team}:</strong><br><strong>End:</strong> ${works[date][team].address}<br><strong>Cli:</strong> ${works[date][team].client}<br><strong>Ser:</strong> ${works[date][team].service}`
             
                ul.appendChild(li)

                if ((today.getTime() > dateStart.getTime() && (works[date][team].status != "Em andamento" && works[date][team].status != "Finalizado")) ||
                    (today.getTime() > dateEnd.getTime() && works[date][team].status != "Finalizado")) {
                    li.classList.add("alert")
                } else {
                    divDay.classList.add("full")
                }

                if (!hasUl) {
                    divDay.appendChild(ul)
                }
            }
        }

    }

}

loadMonth()
readFile()

next.addEventListener("click", () => {
    date.setFullYear(selectedYear)
    date.setMonth(selectedMonth + 1)
    date.setDate(1)
    selectedMonth = date.getMonth()
    selectedYear = date.getFullYear()
    loadMonth()
    readFile()
})

previous.addEventListener("click", () => {
    date.setFullYear(selectedYear)
    date.setMonth(selectedMonth - 1)
    date.setDate(1)
    selectedMonth = date.getMonth()
    selectedYear = date.getFullYear()
    loadMonth()
    readFile()
})

saveWork.addEventListener("click", (event) => {
    //event.preventDefault()
    const form = event.target.parentElement
    const team = form.team.value
    const client = form.client.value
    const service = form.service.value
    const address = form.address.value
    const daysService = parseInt(form.time.value)
    const dateService = new Date(form.date.value)
    dateService.setDate(dateService.getDate() + 1)
    finish = new Date(form.date.value)

    let i = 0
    do {
        finish.setDate(finish.getDate() + 1)
        let isHoliday = false

        const dateString = `${finish.getFullYear()}-${finish.getMonth() + 1}-${finish.getDate()}`
        for (const holiday of holidays) {
            if (holiday.date == dateString) {
                isHoliday = true
            }
        }

        if ((finish.getDay() != 0 && !isHoliday && finish.getDay() != 6) || (dateService.getDay() == 0 || isHoliday && dateService.getDay() == 6)) {
            i++
        }

    } while (i < daysService)

    works[form.date.value] = works[form.date.value] || {}
    works[form.date.value][team] = {
        client,
        service,
        address,
        finish: `${finish.getFullYear()}-${finish.getMonth() + 1}-${finish.getDate()}`,
        status: "Não iniciada"
    }

    saveFile()
})

divCalendar.addEventListener("click", (event)=>{
    const element = event.target
    if(element.tagName=="LI"){
        const date = element.dataset.date
        const team = element.dataset.team
        modal2.style.display = "flex"
        modal2.addEventListener("click", (event)=>{   
            const element = event.target  
             
            if(element.tagName == "INPUT"){
                event.preventDefault()
                works[date][team].status = element.parentElement.status.value
                saveFile()
            }  
        })
        
    }else if(element.className == "close"){
        if(confirm("Deseja apagar esse agendamento?")){
            const date = element.parentElement.dataset.date
            const team = element.parentElement.dataset.team
            delete works[date][team]
            saveFile()
        }
    }
})

modal1.addEventListener("click", (event)=>{
    if(event.target.className=="modal"){
        event.target.style.display = "none"
    }
    
})
modal2.addEventListener("click", (event)=>{
    if(event.target.className=="modal"){
        event.target.style.display = "none"
    }
})

const saveFile = () => {
    fetch("agenda.php",
        { method: 'post', mode: 'cors', body: JSON.stringify(works) }
    )
        .then((response) => {
            console.log(response);
            window.location.reload(true)
        }).catch((error) => {
            console.log(error)
            window.location.reload(true)
        });
}









