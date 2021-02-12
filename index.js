var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {

        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        };

        Expense.prototype.getPercentage = function () {
            return this.percentage;
        }

    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (item) {
            sum += item.value;

        });
        data.totals[type] = sum;
    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    return {
        addItem: function (type, des, val) {
            var newItem, ID;


            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }


            if (type === "exp") {
                newItem = new Expense(ID, des, val);
            } else if (type === "inc") {
                newItem = new Income(ID, des, val)
            }

            data.allItems[type].push(newItem);
            return newItem;
        },

        calculateBudget: function () {
            calculateTotal("exp");
            calculateTotal("inc");

            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (item) {
                item.calcPercentage(data.totals.inc);
            });


        },
        getPercentage: function () {
            var allPer = data.allItems.exp.map(function (item) {
                return item.getPercentage();
            })
            return allPer;
        },


        deleteItem: function (type, id) {
            var ids, index;
            ids = data.allItems[type].map(function (current) {

                return current.id;

            });
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        testing: function () {
            console.log(data);

        }
    };

})();


var UIController = (function () {
    var DOMstrings = {
        inputType: ".add__type",
        inputDesciption: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensexpercentageLabel: ".item__percentage",
        dateLabel: ".budget__title--month"
    };
    var formatNumber = function (num, type) {
        var int, dec, numSplit, type;

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split(".");
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + " ," + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
    };
    var nodelistForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);

        }
    };


    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDesciption).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)

            };
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;

            if (type === "inc") {

                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="fa fa-asterisk"></i></button></div></div></div>'

            } else if (type === "exp") {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="fa fa-asterisk"></i></button></div></div></div>'
            }
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);

        },
        deleteListItem: function (slectorID) {
            var el = document.getElementById(slectorID)
            el.parentNode.removeChild(el);

        },

        clearFields: function () {
            var fields, fieldsArr,
                fields = document.querySelectorAll(DOMstrings.inputDesciption + "," + DOMstrings.inputValue);
            fieldsArr = Array.from(fields);
            fieldsArr.forEach(function (current) {
                current.value = "";
            });
            fieldsArr[0].focus()
        },
        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = "inc" : type = "exp"

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, "inc");
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, "exp");
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";

            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "-";
            }
        },
        displayPercentages: function (percentage) {
            var fields = document.querySelectorAll(DOMstrings.expensexpercentageLabel);




            nodelistForEach(fields, function (current, index) {
                if (percentage[index] > 0) {
                    current.textContent = percentage[index] + "%";
                } else {
                    current.textContent = "---";
                }
            });

        },
        displayMonth: function () {
            var now, year, month, months;

            now = new Date();
            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            month = now.getMonth();
            year = now.getFullYear();


            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + " " + year;

        },
        changeType: function () {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + " ," +
                DOMstrings.inputDesciption + " ," +
                DOMstrings.inputValue

            );
            nodelistForEach(fields, function (cur) {
                cur.classList.toggle("red-focus");
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle("red");
        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();




var controller = (function (budgetctrl, UIctrl) {

    var setupEventlistener = function () {
        var DOM = UIctrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);


        document.addEventListener("keypress", function (e) {
            if (e.keyCode === 13) {
                ctrlAddItem();


            }
        });

        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener("change", UIctrl.changeType)
    };

    var updateBudegt = function () {
        // calculate budget
        budgetctrl.calculateBudget();
        // return budget

        var budget = budgetctrl.getBudget();
        //display budget
        UIctrl.displayBudget(budget);


    };

    var updatePercentage = function () {
        budgetctrl.calculatePercentages();
        var percentage = budgetctrl.getPercentage();
        UIctrl.displayPercentages(percentage);
    };



    var ctrlAddItem = function () {
        var input, newItem;
        input = UIController.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            newItem = budgetctrl.addItem(input.type, input.description, input.value);
            UIctrl.addListItem(newItem, input.type);
            UIctrl.clearFields();
            updateBudegt();
            updatePercentage();
        }

    };

    var ctrlDeleteItem = function (e) {
        var itemID, type, ID, splitID;
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]);


            budgetctrl.deleteItem(type, ID);
            UIctrl.deleteListItem(itemID);
            updateBudegt();
            updatePercentage();
        }
    };

    return {
        init: function () {
            console.log("function has started");
            UIctrl.displayMonth();
            UIctrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1

            });
            setupEventlistener();


        }
    };

})(budgetController, UIController);

controller.init();


