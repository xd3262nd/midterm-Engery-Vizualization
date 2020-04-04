// API to get state ID
var stateIDAPI = 'https://api.eia.gov/category/?api_key=563a38170142e2aa6fea13b9725fa259&category_id=1'
// API to get the specific data for a specific state
var dataAPI = 'https://api.eia.gov/series/?api_key=563a38170142e2aa6fea13b9725fa259&series_id='

// var selectedStateA;


let idA;
let idB;

var stateA = document.querySelector('#state1')
var stateB = document.querySelector('#state2')

var buttonEl = document.querySelector("#Generate")



var stateList = ["Alabama", "Alaska", "American Samoa", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District Of Columbia", "Federated States Of Micronesia", "Florida", "Georgia", "Guam", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Marshall Islands", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Northern Mariana Islands", "Ohio", "Oklahoma", "Oregon", "Palau", "Pennsylvania", "Puerto Rico", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virgin Islands", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]



var dateList = [];

let setA = {}
let setB = {}

let count = 0

buttonEl.addEventListener("click", () => {


    var inputA = stateA.value.toLowerCase()
    var inputB = stateB.value.toLowerCase()


    var yearAValue = yearA.options[yearA.selectedIndex].value
    var yearBValue = yearB.options[yearB.selectedIndex].value

    var monthAValue = monthA.options[monthA.selectedIndex].value
    var monthBValue = monthB.options[monthB.selectedIndex].value



    if (yearAValue > yearBValue){
        alert('Please enter the correct order of year ')

    } else if (yearAValue === yearBValue){

        // * this is when having the same year

        if(monthAValue > monthBValue){
            alert('Please enter the date value correctly. Choose your start year-month value first')
        }else{
            start = yearAValue + monthAValue //ex:201901
            end = yearBValue + monthBValue //ex: 201912
            //functin that will return list of index will have endDate first and startDate last
            dateList = dateRange (start, end)

        }

    }else{

        // * this is when the year is different 

        //combining the monthYear together
        startYear = yearAValue + monthAValue
        endYear = yearBValue + monthBValue

        //functin that will return list of index will have endDate first and startDate last
        dateList = dateRange(startYear, endYear)

    }

    if(!inputA || !inputB){
        alert('Please enter your inputs for both state')
    } else {
        // make sure user enters the correct state
        validateStateName (inputA, inputB)        
    }
        

})


function dateRange(start, end){
    
    // Get the index number that will be on the API dataset 
    // Return list that will be used for the API call

   var dateIndex = []

   for(var i = 0; i<yearMonthTotal.length; i++){
       if(yearMonthTotal[i] === end){
           dateIndex.unshift(i+1)
       }else if(yearMonthTotal[i] === start ){
           dateIndex.push(i+1)
       }
   }
  

   return dateIndex

}


function validateStateName(inputA, inputB){
    let a = 0
    let b = 0

    for( var i = 0; i<stateList.length; i++){
        let stateName = stateList[i].toLowerCase()
        if (stateName === inputA.toLowerCase()){
            a = a + 1
        } else if (stateName === inputB.toLowerCase()){
            b = b + 1
        }
    }
    //When the state is being verified, will make the API call via the getStateIDJSON
    if (a == 1 && b==1){
        getStateIDJSON(inputA,dateList, getStateID)
        getStateIDJSON(inputB,dateList, getStateID)
    } else{
        // Ask the user enter the inputs again
        alert('Please check your state name')
    }




}



function getStateIDJSON(stateName, indexList, callback) {
    // this function is mainly to call and get all the state ID data from the API Call
    
    fetch(stateIDAPI).then(res => {
        console.log(res)
        return res.json()
    })
    .then(stateData => { 
        callback(stateData, stateName, indexList)

    })
    .catch(err => {
        console.log(err)
    })

}


function getStateID(dataSet, stateName, indexList){

    // Function to process the API data from the `getStateIDJSON` 
    // This function will grab the state ID for the respective state
    // And then pass to another function to call that particular state energy data

    dataSet.category.childseries.forEach(function(element, index) {
        var dataNameList = element.name.toLowerCase()

        if (dataNameList.includes(stateName) && dataNameList.includes('monthly')) {

            let stateID = element.series_id //id to get the specific data for the state

            getStateDataFromAPI(stateID, indexList)

        }


    })

}

function getStateDataFromAPI(id, indexList) {

    var listA = {}
    var listAData = []
    
    fetch(dataAPI + id).then(res =>{
        return res.json()
    })
    .then(datas => {

        datas.series[0].data.forEach(function(el, index) {

            // el is the each array of ["201911", 15065.73011] 
            //for loop here will go through each value [0]: key , [1] is the value 
    
            if(index >= indexList[0] && index <= indexList[1]){
                listAData.unshift(el[1])
                // key contains year-month; value contains data
                listA[el[0]] = el[1]      
            }
            
        })
        // get the distance between the selected date range - to use later to validate that we collected data for both state before generate the bar chart
        let distance = indexList[1] - indexList[0] + 1;

        dataLength = Object.keys(listA).length; 

        // to validate when all the data has been added by using the object length
        if(dataLength == distance){
            storeData(listA)
        }
    })
    .catch(err => {
        console.log(err)
    })
}

function storeData(dataObjects){

    // Makesure the first dataset go to setA
    // Function that is being used to store the dataset and then call another API call for the other state - before generate the bar chart

    if(count == 0){
        setA = dataObjects
        count += 1
    }else if(count >0){
        setB = dataObjects
    
    }
    // this will only run when both of the state data are passed to this function 
    while(Object.keys(setA).length === Object.keys(setB).length && Object.keys(setA).length >0 && Object.keys(setB).length >0){
        conversion(setA, setB)
        break
    }
}


function conversion(dataSetA, dataSetB){
    // Function that is used to convert all the data into the `generateChart` function
    // 

    let dateListA = Object.keys(dataSetA) //return an array of the key = yearMonth
    let dateListB = Object.keys(dataSetB) 


    let dataA = Object.values(dataSetA) //data
    let dataB = Object.values(dataSetB)


    var months = [] //getting the month number ; example "01"

    if(dateListA.length == dateListB.length){

        for(var n = 0; n<dateListA.length; n++){
            var converts = parseInt(dateListA[n])
            // regex to check that the converts is format as 4 digits and 2 digits 
            var regExTest = /^\d{4}(\d{2})$/g
            var matchArr = regExTest.exec(converts)
            months.push(matchArr[1]) 
        }
        // generating the bar
        generateChart(dataA, dataB, months)
    }
}



