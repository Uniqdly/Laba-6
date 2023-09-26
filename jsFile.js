const n = prompt("Введите размер поля");
let TABLE_WIDTH = n;
let TABLE_HEIGHT = n;

let startCell = null;
let targetCell = null;
let canEditTable = true;

let ACTIONS = {ADD_WALL: 0, REMOVE_WALL: 1, ADD_START: 2, ADD_END: 3, SELECTED: 0};

/*Обозначение классов*/
let Class = {
    STRONG_WALL: 'metal',
    WALL: 'wall',
    START_POINT: 'start',
    END_POINT: 'end',
    OPEN: 'open',
    CLOSED: 'closed',
    PATH: 'path'
};

let tableElements = [];

let randomMazeBtn = document.querySelector('#randomMazeBtn');
randomMazeBtn.onclick = generateRandomMaze;

let table = document.querySelector("#table");
let runBtn = document.querySelector('#run')
let clearBtn = document.querySelector('#clear')

tableElements.push(randomMazeBtn);
tableElements.push(runBtn);
tableElements.push(clearBtn);


(function prepareRadio() {

    let elementsByName = document.getElementsByName('action');

    let addWall = document.querySelector('#addWall');
    addWall.onclick = () => ACTIONS.SELECTED = ACTIONS.ADD_WALL
    addWall.checked = true;

    tableElements.push(...elementsByName);

    document.querySelector('#removeWall').onclick = () => ACTIONS.SELECTED = ACTIONS.REMOVE_WALL;
    document.querySelector('#addStart').onclick = () => ACTIONS.SELECTED = ACTIONS.ADD_START;
    document.querySelector('#addEnd').onclick = () => ACTIONS.SELECTED = ACTIONS.ADD_END;
})();


/*Создаём верхнее табло*/
(function fillTableAndAddListeners() {

    
    let mouseDown = false;
    document.addEventListener('mousedown', () => mouseDown = true);
    document.addEventListener('mouseup', () => mouseDown = false);

    for (let i = 0; i < TABLE_HEIGHT; i++) {
        let newRow = table.insertRow();
        for (let j = 0; j < TABLE_WIDTH; j++) {
            let cell = newRow.insertCell();

            let classList = cell.classList;

            if (i === 0 || i === TABLE_HEIGHT - 1 || j === 0 || j === TABLE_WIDTH - 1) {
                classList.add("metal");
            }

            cell.onmousedown = () => {
                if (canEditTable) {
                    fillCell(cell)
                }
                return false;
            }

            cell.onmouseover = () => {
                if (mouseDown && canEditTable) {
                    fillCell(cell)
                }
            }
            
        }
    }
    

    function fillCell(cell) {
        let classList = cell.classList
        switch (ACTIONS.SELECTED) {

            case ACTIONS.ADD_WALL: {
                if (cell.className === '') {
                    classList.add('wall')
                }
                break;
            }
            
            case ACTIONS.ADD_END: {
                if (cell.className === '') {
                    if (targetCell !== null) {
                        targetCell.classList.remove('end');
                    }
                    classList.add('end')
                    targetCell = cell;
                }

                break;
            }
            case ACTIONS.ADD_START: {
                if (cell.className === '') {
                    if (startCell !== null) {
                        startCell.classList.remove('start');
                    }
                    classList.add('start')
                    startCell = cell;
                }
                break;
            }
            case ACTIONS.REMOVE_WALL: {
                if (classList.contains('wall')) {
                    classList.remove('wall')
                }
                break;
            }
        }
    }
}());



function checkStartIsPossible() {
    return startCell != null && targetCell != null;
}


class Point {

    constructor(value, x, y) {
        this.inOpenList = false;
        this.inClossedList = false;
        this.startPoint = false;
        this.endPoint = false;
        this.parent = this;
        this.h = 0;
        this.g = 0;
        this.f = 0;
        this.Name = value;
        this.x = x;
        this.y = y;
        
    }

    setValue(value) {
        this.value = value;
    }//значение для текущей ячейки.

    getG() {
        return this.g; //значение для текущей ячейки.
    }

    getParent() {
        return this.parent; //возвращает родительскую ячейку для текущей ячейки.
    }

    setParent(parent) {
        this.parent = parent; //устанавливает родительскую ячейку для текущей ячейки.
    }

    getF() {
        return this.f; //возвращает значение f для текущей ячейки.
    }

    isStartPoint() {
        return this.startPoint; //возвращает  true, если текущая ячейка является начальной точкой.
       
    }

    setStartPoint() {
        this.startPoint = true;//устанавливает текущую ячейку как начальную точку.
    };

    isEndPoint() {
        return this.endPoint; //возвращает  true, если текущая ячейка является конечной точкой.
       
        
    }

    setEndPoint() {
        this.endPoint = true;//устанавливает текущую ячейку как конечную точку.
    }

    getX() {
        return this.x;
    }
// возвращают координаты текущей ячейки.
    getY() {
        return this.y;
    }

    getName() {
        return this.Name;
    };

    setHGF(h, g) {
        this.h = h * 10;
        this.g = g + this.parent.g;//устанавливает значения   h ,  g и f для текущей ячейки.
        this.f = this.h + this.g;
    };

    addOpenList() {
        this.inOpenList = true;//добавляет текущую ячейку в открытый список.
    };

    isInOpenList() {
        return this.inOpenList;//возвращает true, если текущая ячейка находится в открытом списке.
      
        
    };

    moveToClosedList() {
        this.inClossedList = true;
        this.inOpenList = false;//возвращает true, если текущая ячейка находится в открытом списке.
        
        
    };

    inClosedList() {
        return this.inClossedList; //возвращает true, если текущая ячейка находится в закрытом списке.
    };

}
function generateRandomMaze()// случайным образом генерирую стены 
{
    for (let i = 1; i < TABLE_HEIGHT - 1; i++) {
      for (let j = 1; j < TABLE_WIDTH - 1; j++) {
        if (Math.random() < 0.3) { 
          let cell = table.rows[i].cells[j];
          if (!cell.classList.contains(Class.START_POINT) && !cell.classList.contains(Class.END_POINT)) {
            cell.classList.add(Class.WALL);
          }
        }
      }
    }
  }

function blockAll(flag) {
    canEditTable = !flag;
    for (let val in tableElements) {
        tableElements[val].disabled = flag;
    }
}


runBtn.onclick = function () {

    if (!checkStartIsPossible()) {//Проверяем, что начальная и конечная точки добавлены
        alert("Нужно добавить начальную и конечную точку");
        return;
    }

    blockAll(true);

    
    let delay = 10;


    let openList = [];
    let closedList = [];
    let targetPoint;
    let parentPoint;
    let array = [TABLE_HEIGHT];

    for (let row = 0; row < TABLE_HEIGHT; row++) {
        array[row] = [TABLE_WIDTH];
        for (let col = 0; col < TABLE_WIDTH; col++) {
            let tmp = table.rows[row].cells[col];
            if (tmp.className === Class.STRONG_WALL || tmp.className === Class.WALL) {
                array[row][col] = new Point('#', col, row);//Проверяю ячейки и если это стена или граница, то создаю поинт #
            } else if (tmp.className === Class.START_POINT) {
                let point = new Point('S', col, row); //Проверяю ячейки и если это точка старта, создаю поинт S со значением 0
                point.setStartPoint();
                point.setValue(0);
                array[row][col] = point;
                openList.push(point);
            } else if (tmp.className === Class.END_POINT) {
                let point = new Point('E', col, row);//Проверяю ячейки и если это точка финиша, создаю поинт Е и помечаю его как конечный
                point.setEndPoint();
                targetPoint = point;
                array[row][col] = point;
            } else {
                array[row][col] = new Point('0', col, row);
            }
        }
    }


    let timer = setInterval(function () {
        if (openList.length !== 0 && targetPointNotInOpenList()) {
            parentPoint = popMinElementFromOpenList();

            if (parentPoint === null) {
                alert('Путь отсутствует');
                clearInterval(timer);
            }

            addInClosedList(parentPoint);
            checkPoint(-1, 0);
            checkPoint(-1, -1);
            checkPoint(0, -1);
            checkPoint(1, -1);
            checkPoint(1, 0);
            checkPoint(1, 1);
            checkPoint(0, 1);
            checkPoint(-1, 1);
        } else {
            clearInterval(timer);
            printAStar();
        }
    }, delay);


    function printAStar() {
        if (targetPointNotInOpenList()) {
            alert("Путь отсутсвует");
            clearBtn.disabled = false;
            return;
        }
        let parent = targetPoint.getParent();

        while (!parent.isStartPoint()) {
            table.rows[parent.getY()].cells[parent.getX()].className = Class.PATH;
            targetPoint = parent;
            parent = targetPoint.getParent();
        }
        clearBtn.disabled = false;
    }


    function targetPointNotInOpenList() {
        for (let property in openList) {
            if (openList[property].isEndPoint()) {
                return false;
            }
        }
        return true;
    }


    function popMinElementFromOpenList() {
        let minF = Infinity;
        let minElementIndex = null;

        for (let index in openList) {//ищу в списке минимальное чило и удаляю его из списка
            if (minF > openList[index].getF()) {
                minF = openList[index].getF();
                minElementIndex = index;
            }
        }

        let result = openList[minElementIndex];
        openList.splice(minElementIndex, 1);

        return result;
    }


    function checkPoint(x, y) {//функция используется в алгоритме поиска пути для проверки, является ли заданная точка допустимой для поиска пути, и для обновления ее значений, если она достижима через более дешевый путь.
        let tmpX = parentPoint.getX() + x;
        let tmpY = parentPoint.getY() + y;
        let verifiablePoint = array[tmpY][tmpX];
        if (verifiablePoint.getName() !== '#' && !verifiablePoint.inClosedList()) {
            let currG = x !== 0 && y !== 0 ? 14 : 10;
            let h = Math.abs(tmpX - targetPoint.getX()) + Math.abs(tmpY - targetPoint.getY());
            if (verifiablePoint.isInOpenList()) {
                // стоимость от новой закрытой точки
                let newG = parentPoint.getG() + currG;
                // прыдущая стоимость
                let oldG = verifiablePoint.getG();
                if (newG <= oldG) {
                    verifiablePoint.setParent(parentPoint);
                    verifiablePoint.setHGF(h, currG);
                }
            } else {
                verifiablePoint.setParent(parentPoint);

                verifiablePoint.setHGF(h, currG);
                addInOpenList(verifiablePoint);
            }
        }
    }

    function setPointClass(point, clazz) {
        let curTD = table.rows[point.getY()].cells[point.getX()];
        if (curTD.className !== Class.START_POINT && curTD.className !== Class.END_POINT) {
            curTD.className = clazz;
        }
    }


    function addInOpenList(point) {
        setPointClass(point, Class.OPEN)
        point.addOpenList();
        openList.push(point);
    }


    function addInClosedList(point) {
        setPointClass(point, Class.CLOSED)
        point.moveToClosedList();
        closedList.push(point);
    }


}


clearBtn.onclick = function () {//чищу поле и даю возможность на нём рисовать
    for (let i = 0; i < TABLE_HEIGHT; i++) {
        for (let j = 0; j < TABLE_WIDTH; j++) {
            let curTD = table.rows[i].cells[j];
            if (curTD.className === Class.OPEN || curTD.className === Class.CLOSED || curTD.className === Class.PATH) {
                curTD.className = '';
            }
        }
    }
    blockAll(false);
}