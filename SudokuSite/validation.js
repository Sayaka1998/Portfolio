// Execute the following functions after loading main.js completely
$(function(){  
    // Check each tile if it has a number
    const validation = () => {
        let flag = false;
        // Loop through each .tile class element
        $.each($(".tile"),(index,number) => {
            // If a tile don't have anything in it, the flag will change to false, button will be disabled and break out of the loop
            if($(".tile").eq(index).text() == "") {
                flag = true;
                $("button").attr("disabled", true);
                return false;
            }
        })
        // If all tiles have numbers, flag remains true and: validation button show up, log the matrix into the console and run the converNumber function (stored globally)
        if(!flag) {
            $("button").attr("disabled", false);
            console.log(matrix);
            window.globalFunction.convertNumber();
        }
    }

    // Function to input numbers in blank tiles
    const inputHandler = (e) => {
        // If tiles are empty OR do not contain the initial numbers, users are able to input a number.
        if($(e.target).text() == "" || $(e.target).hasClass("addednumber")) {
            // The tile inner text will be "" by default, the class .addednumber will be assigned to the tile and an input box will be appended to the tile
            $(e.target).text("");
            $(e.target).addClass("addednumber");
            let input = $("<input type='number'>");
            $(e.target).append(input);
            input.focus();
            // When input blurs, the value of the input is set as .tile's text, and removes the input box
            $(input).on("blur", (e) => {
                const inputValue = parseInt($(e.target).val());
                if(0 < inputValue && inputValue < 10) {
                    // e.target 's parent is the tile, which will be assigned the inputValue.
                    $(e.target).parent().text(inputValue);
                }
                // Remove the input box
                $(e.target).remove();

                // Run the validation function every time a tile blurs
                validation();
            });
        }
    }
    // When the elements with .tile class are clicked, run the inputHandler function
    $(document).on("click", ".tile", inputHandler);

    // Function to validate that the matrix does not have any duplicates in rows, columns and boxes
    const checkMatrix = () => {
        // First get the matrix from session storage
        let matrix = JSON.parse(sessionStorage.getItem("Matrix"));

        // Create 9 sets for rows, columns and boxes (sets don't allow duplicates). The sets will be used to compare the matrix rows to the set and check for duplicates.
        for (let i=0; i<9; i++) {
            let row = new Set(),
                col = new Set(),
                box = new Set();

            // Assign the values of the matrix to rows, cols and boxes
            for (let j=0; j<9; j++) {
                let _row = matrix[i][j];
                let _col = matrix[j][i];
                let _box = matrix[3*Math.floor(i/3)+Math.floor(j/3)][3*(i%3)+(j%3)]

                // If a value is a number then check if that number is already in the set.
                // If value is in the set, break the loop and return false. If not, add it to the set.
                if (!isNaN(_row)) {
                    if (row.has(_row)) return false;
                    row.add(_row);
                }
                if(!isNaN(_col)) {
                    if (col.has(_col)) return false;
                    col.add(_col);
                }
                if (!isNaN(_box)) {
                    if (box.has(_box)) return false;
                    box.add(_box);
                }
            }
        }
        // If no duplicates were found, return true.
        return true;
    }

    // Function to check the result of checkMatrix and display alert based on result.
    const checkWin = () => {
        if(checkMatrix()) {
            alert("Congratulations merry christmas go buy yourself some chocolate after the class. Also you get 100 in the final exam and please go to front desk to receive your Canada Permanent Residency. Also, Microsoft called and they want to hire you as CEO.")
        } else {
            alert("Do you even know how to play SODOKO? Fix this mess before I call the police.");
        }
    }

    $("button").on("click", checkWin);
})