let chart = document.getElementById('resultChart').getContext('2d');

let yearArray = [];
let yearMonthTotal = [];
let monthArray = ["12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01"];

let month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

let year01;
let month01;

let year02;
let month02;

//Dictionary to store the Month as the key and numeric month as the value
let wordsMonth = {}
let counts = 11


let yearA = document.getElementById('inputYear01')
let monthA = document.getElementById('inputMonth01')

let yearB = document.getElementById('inputYear02')
let monthB = document.getElementById('inputMonth02')

for(let x=0; x<month.length; x++){

   if(x<10){
       wordsMonth[month[x]] = monthArray[counts]
       
   }else{
        wordsMonth[month[x]] = monthArray[counts]
        
   }
    counts = counts - 1
}


yearA.addEventListener('change', (e)=>{

    let el = document.getElementById('inputYear01');
    year01 = el.options[el.selectedIndex].value

})

monthA.addEventListener('change', (e)=>{

    let el = document.getElementById('inputMonth01');
    month01 = el.options[el.selectedIndex].value


})

yearB.addEventListener('change', (e)=>{

    let el = document.getElementById('inputYear01');
    year02 = el.options[el.selectedIndex].value

})

monthB.addEventListener('change', (e)=>{

    let el = document.getElementById('inputMonth01');
    month02 = el.options[el.selectedIndex].value
 

})

generateYear(yearA)
generateYear(yearB)

generateMonth(monthA)
generateMonth(monthB)


for(let i=0, l=yearA.childNodes.length; i<l; i++){
    if (yearA.childNodes[i].nodeName === 'OPTION') yearArray.push(yearA.childNodes[i].value)

}
for(let a = 0; a<yearArray.length; a++){
   getYearMonthList(yearArray[a])  
}


function capitalizeLetter( string ){

    // function to capitalize the state letter and print them as the title
    
    let str = string.value
    let pieces = str.split(" ");
    for ( let i = 0; i < pieces.length; i++ )
    {
        let j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].slice(1).toLowerCase();
    }
    return pieces.join(" ");
}


function generateYear(yearInput) {
    // get the year that show on the UI dropdown
    let start_year = new Date().getFullYear();
    let choices = "";

    for(let i=start_year-1; i>start_year-20; i--){
        choices +='<option value="' + i + '">' + i + '</option>';
    }
    yearInput.innerHTML = choices;

}


function generateMonth(monthInput){

    // get the month that there is on the UI dropdown
    let choices = "";

    for (let i = 0 ; i<month.length; i++){
        let num = i+1;
        if (num<10){
            choices += '<option value="0' + num + '">' + month[i] + '</option>';
        }else{
            choices += '<option value="' + num + '">' + month[i] + '</option>';
        }
    }
    monthInput.innerHTML = choices
}



function getYearMonthList(year){

    // Create a list of possible year and month based on the dropdown menu provided to the user
    for(let b=0; b<monthArray.length; b++){
        let yearMonth = year + monthArray[b]
        yearMonthTotal.push(yearMonth)
    }
}


function generateChart(dataA,dataB, monthList) {


    let sA = document.querySelector('#state1')
    let sB = document.querySelector('#state2')

    let stateA = capitalizeLetter(sA)
    let stateB = capitalizeLetter(sB)

    let monthLabels = []
    for(let f=0; f<monthList.length; f++){

        Object.keys(wordsMonth).forEach(function (el) {

            if(wordsMonth[el] === monthList[f]){
                monthLabels.push(el)
            }
        })

    }

    function generateRandomColor(){
    
        // Generate random red, blue, green
        let red = Math.floor(Math.random() * 255)
        let blue = Math.floor(Math.random() * 255)
        let green = Math.floor(Math.random() * 255)
        // Create a color using rgb(r, g, b) format
        let randomColor = `rgb(${red}, ${green}, ${blue})`
        return randomColor
    }

   let colorA = generateRandomColor()
   let colorB = generateRandomColor()


    let newChart = new Chart(chart, {

        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [{
                label: stateA,
                backgroundColor: colorA,
                yAxisID: "y-axis-1",
                data: dataA

            }, {
                label: stateB,
                backgroundColor: colorB ,
                yAxisID: "y-axis-2",
                data: dataB

            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: "Bar Chart for Fuels Net Generate at " + stateA + " and " + stateB
            },
            tooltips: {
                mode: 'index',
                intersect: true
            },
            scales: {
                yAxes: [{
                    type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: "left",
                    id: "y-axis-1",
                }, {
                    type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                    display: true,
                    position: "right",
                    id: "y-axis-2",
                    gridLines: {
                        drawOnChartArea: false
                    }
                }],
            }
        }

    })
    chart.update();
}












