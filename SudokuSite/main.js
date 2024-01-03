let matrix = [];
// This function will take the numbers of the board and put them into a matrix array so that game validation is easier to do
const convertNumber = () => {
    // First create 9 arrays for each row of the board
    matrix = [];
    let array1 = [];
    let array2 = [];
    let array3 = [];
    let array4 = [];
    let array5 = [];
    let array6 = [];
    let array7 = [];
    let array8 = [];
    let array9 = [];
    // Find elements with .col class and run the following function
    $(".col").each(function (){
        // If .cols parent's (box) index is 0 to 2 (top boxes on the board)
        if($(this).parent().index() < 3) {
            // Loop through those first 3 boxes
            for(let j = 0; j < 3; j++) {
                if(j == 0) {
                    // Grab the .cols children (tiles) text, parse it into integer and push them to the first array.
                    array1.push(parseInt($(this).children().eq(j).text())); // = tile[0].text
                    // When the loop reaches the top right tile of the third box, push the entire array into the matrix array (first row of the matrix).
                    if($(this).index() == 2) { // => index of the col == 2
                        if($(this).parent().index() == 2) { // => the index of box == 2, right side
                            matrix.push(array1);
                        }
                    }
                }
                if(j == 1) {
                    array2.push(parseInt($(this).children().eq(j).text()));
                    if($(this).index() == 2) {
                        if($(this).parent().index() == 2) {
                            matrix.push(array2);
                        }
                    }
                }
                if(j == 2) {
                    array3.push(parseInt($(this).children().eq(j).text()));
                    if($(this).index() == 2) {  
                        if($(this).parent().index() == 2) {
                            matrix.push(array3);
                        }
                    }
                }
            }
        }
        // Same thing is happening here but now with box's index 3 to 5
        if(3 <= $(this).parent().index() && $(this).parent().index() < 6) {
            for(let j = 0; j < 3; j++) {
                if(j == 0) {
                    array4.push(parseInt($(this).children().eq(j).text()));
                    if($(this).index() == 2) {
                        if($(this).parent().index() == 5) {
                            matrix.push(array4);
                        }
                    }
                }
                if(j == 1) {
                    array5.push(parseInt($(this).children().eq(j).text()));
                    if($(this).index() == 2) {
                        if($(this).parent().index() == 5) {
                            matrix.push(array5);
                        }
                    }
                }
                if(j == 2) {
                    array6.push(parseInt($(this).children().eq(j).text()));
                    if($(this).index() == 2) {
                        if($(this).parent().index() == 5) {
                            matrix.push(array6);
                        }
                    }
                }
            }
        }
        // // Same thing is happening here but now with box's index 6 to 8
        if(6 <= $(this).parent().index() && $(this).parent().index() < 9) {
            for(let j = 0; j < 3; j++) {
                if(j == 0) {
                    array7.push(parseInt($(this).children().eq(j).text()));
                    if($(this).index() == 2) {
                        if($(this).parent().index() == 8) {
                            matrix.push(array7);
                        }
                    }
                }
                if(j == 1) {
                    array8.push(parseInt($(this).children().eq(j).text()));
                    if($(this).index() == 2) {
                        if($(this).parent().index() == 8) {
                            matrix.push(array8);
                        }
                    }
                }
                if(j == 2) {
                    array9.push(parseInt($(this).children().eq(j).text()));
                    if($(this).index() == 2) {
                        if($(this).parent().index() == 8) {
                            matrix.push(array9);
                        }
                    }
                }
            }
        }
    })
    // Save the matrix into session storage to get it later for validation
    sessionStorage.setItem("Matrix", JSON.stringify(matrix));
}
// Make convertNumber function global to use it in another js file
window.globalFunction = {};
window.globalFunction.convertNumber = convertNumber;

const valueList = [];
const numList = [];

const numberPoper = () => {

    // For each number in the numList return the index and value of the numbers
    $.each(numList,(numIndex,numValue) => {
        // For each of the returned values, return their index and values and create a column, row and number
        $.each(numValue,(numIdx,numVal) => {
            let column = null;
            let row = null;
            let number = null;
            // If the index of the returned values are either 0 or 1 this means that they are coordinates or column and row, else it is a value to put on the board.
            $.each(numVal,(numI,numV) => {
                if(numI == 0) {
                    column = numV - 1;
                } else if (numI == 1) {
                    row = numV - 1;
                } else {
                    number = numV;
                }
            })
            // Find the box with the .box class and navigate through the rows and columns of the numList in order to put the values as text in the tiles.
            $(".box").eq(numIndex).children().eq(column).children().eq(row).text(number);
        })
    })
}

// Function to create the grid of the sudoku board
const tablePoper = () => {
    // First create the board and give it the large-box class from css file
    const lgBox = $("<div></div>");
    lgBox.addClass("large-box");

    // Create 9 boxes with the box class from css file
    for(let i = 0; i < 9; i++) {
        const box = $("<div></div>");
        box.addClass("box");

        // Create 9 columns for the boxes with the col class from css file
        for(let j = 0; j < 3; j++) {
            const colBox = $("<div></div>");
            colBox.addClass("col");

            // Create the tiles and append them to the columns created before
            for(let k = 0; k < 3; k++) {
                const tile = $("<div></div>");
                tile.addClass("tile");
                colBox.append(tile);
            }
            // Append the columns to the boxes
            box.append(colBox);
        }
        // Append the boxes to the board
        lgBox.append(box);
    }
    // Append the board to the html body and run the numberPoper function
    $("body").append(lgBox);
    numberPoper();
    // convertNumber();
}

// Function to split each item of the valueList into 3 sets of 3 numbers
const splitVal = () => {
    // For each item in the valueList, return the index and value of that item.
    $.each(valueList, (index,value) => {
        // The first 3 characters of the item will be asigned to variable val1, the next to val2 and the last to val3.
        // substr(0,3) means: Start from index 0 and grab 3 numbers.
        let val1 = value.val.substr(0,3);
        let val2 = value.val.substr(3,3);
        let val3 = value.val.substr(6,3);

        // Create an array with the 3 variables we just created above. This array will show 9 separate arrays with 3 sets of 3 numbers.
        const numArray = [val1,val2, val3];
        // console.log(numArray);

        // This loop will assign a variable to each number inside the sets of 3.
        $.each(numArray,(idx,val) => {
            // The first number of the set will be assigned to v1, the next to v2 and the last to v3.
            // substr(0,1) means: Start from index 0 and grab 1 number
            let v1 = val.substr(0,1); // This can be also val[0]
            let v2 = val.substr(1,1); // This can be also val[1]
            let v3 = val.substr(2,1); // This can be also val[2]

            // This takes the numArray we created above and for each set of 3 numbers, it will create another array with 3 sets of 1 number each.
            numArray[idx] = [v1, v2, v3];
        })
        // Add everything in numArray to the numList.
        numList.push(numArray);
    })
    // Run tablePoper function
    tablePoper();
}

// console.log(numList);
// console.log(valueList);
   
// Getting the data from the JSON file and storing the values into an array called valueList.
const load = () => {
    $.getJSON("./realData.json",(result) => {
        // Here is a step missing (if status == "success" then run the rest of the code).

        // For each of the items in the array, return them in the order of index and value.
        $.each(result,(index,value) => {

            // Object constructor. Maybe we can make this on a separate JS file and import the class here.
            function num(val) {
                this.val = val;
            }
            // Create instance of the num object and push it to the valueList.
            const numObj = new num(value.val);
            valueList.push(numObj);
        })
        // Run splitVal function.
        splitVal();
    })
}
// Run the load function to get the JSON data.
load();
