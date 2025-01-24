
// Refrencing
const disp = document.getElementById('disfield')
const equal = document.getElementById('equal')
const addbtn = document.getElementById('addbtn')
const minusbtn = document.getElementById('minusbtn')
const mulbtn = document.getElementById('mulbtn')
const divibtn = document.getElementById('divibtn')
const modbtn = document.getElementById('modbtn')
const period = document.getElementById('period')
const inverse = document.getElementById('inverse')
const sqr = document.getElementById('sqr')
const funs = document.getElementById('functions')
const clear_all = document.getElementById('clear-all')
const clear_last = document.getElementById('clear-last')
const mc = document.getElementById('mc')
const mr = document.getElementById('mr')
const madd = document.getElementById('madd')
const msubt = document.getElementById('msubt')
const ms = document.getElementById('ms')
const memoField = document.getElementById('memoField')
const memo = document.getElementById('memo')
const showMemo = document.getElementById('showMemo')

const optDict = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '%': 2
}


const numsDict = ['0','1', '2', '3', '4', '5', '6', '7', '8', '9']

let state = false

addbtn.value = '+'
minusbtn.value = '-'
mulbtn.value = '*'
divibtn.value = '/'
modbtn.value = '%'
period.value = '.'

const numbtns = []

disp.value = ''


class Calculator{
    constructor(){
        this.distext = ''
        this.memory = ''
    }

    get(){
        return this.distext
    }

    set(value){
        this.distext = (value).toString()
    }
    
    getMemo(){
        return this.memory
    }

    setMemo(val){
        this.memory = (val).toString()
        memo.textContent = (this.memory).toString()
    }

    addToMemo(val){
        this.memory = (parseFloat(this.memory) + parseFloat(val)).toString()
        memo.textContent = (this.memory).toString()
    }

    minusToMemo(val){
        this.memory = (parseFloat(this.memory) - parseFloat(val)).toString()
        memo.textContent = (this.memory).toString()
    }

    clearMemo(){
        this.memory = ''
        memo.textContent = (this.memory).toString()
    }

    readMemo(){
        this.distext = this.memory
        disp.value = this.distext
    }

    append(val){
        this.distext = this.distext + val
    }

    getLen(){
        return this.distext.length
    }

    clearLast(){
        if(this.distext.length > 0){
            this.distext = this.distext.slice(0,this.distext.length-1)
        }
    }

    clearAll(){
        this.distext = ''
    }

    doOperation(opt, lit1, lit2){
        switch (opt) {
            case '*':
                return (lit1 * lit2)
    
            case '/':
                return (lit1 / lit2)
    
            case '+':
                return (lit1 + lit2)
    
            case '-':
                return (lit1 - lit2)
    
            case '%':
                return (lit1%lit2)
    
            default:
                break;
        }
    
        return 0;
    }

    extractData(){
        const data = []
    
        console.log('Display field: ',this.get())
        console.log('Length of the display: ',this.getLen())
        let operand = ''
        for(let i1 = 0;i1<this.getLen();i1++){
            console.log('Hi')
            const ch = this.distext.at(i1)
            const res = ch in numsDict
            console.log(ch)
    
            if(res || (ch == '.')){
                operand = operand + ch
            }else{
                if(operand == '') data.push(0);
                else data.push(parseFloat(operand));
                
                data.push(ch)
                operand = ''
            }
        }
    
    
        if(operand != ''){
            data.push(parseFloat(operand));
        }
        else if((data.length > 0) && (data[data.length-1] in optDict) ){
            data.push(0);
        }else if((data.length > 0) && (data[data.length-1] == '.')){
            operand = operand + '0'
            data.push(parseFloat(operand))
        }
        
    
        console.log('Extracted data: ', data)
        return data
    }

    evaluate(){

        const data = this.extractData();
    
        const lits = []
        const opStack = []
        
        for(let i = 0;i<data.length;i++){
            if(!(data[i] in optDict)){
                lits.push(data[i])
            }else if(opStack.length == 0){
                opStack.push(data[i])
            }else {
                while((opStack.length > 0) && (optDict[opStack.at(opStack.length - 1)] >= optDict[data[i]])){
                    const lit2 = lits.pop()
                    const lit1 = lits.pop()
                    const opt = opStack.pop()
                    
                    try {
                        const ans = this.doOperation(opt, lit1, lit2)
                        lits.push(ans)
                        console.log(ans)
                    } catch (error) {
                        alert(error)
                    }
                }
    
                opStack.push(data[i])
            }
        }
    
        while(opStack.length > 0){
            const opt = opStack.pop()
            const lit2 = lits.pop()
            const lit1 = lits.pop()
    
            const ans = this.doOperation(opt, lit1, lit2)
            lits.push(ans)
            console.log(ans)
        }
    
        console.log(lits)
    
        if(lits.length > 0) return lits.at(lits.length-1);
        else return 0;
    }
}

const calc = new Calculator()

for(let i = 0;i<10;i++){
    const ele = document.getElementById(`l${i}`)
    ele.addEventListener('click',
        function(){ 
            if(state){
                // distext = `${i}`
                calc.set(`${i}`)
                state = false
            }else{
                console.log(`Button l${i} is clicked!`)
                // distext = distext + `${i}`
                calc.append(`${i}`)
            }
            
        })
    numbtns.push(ele)
}

addbtn.addEventListener('click',opValidate)
minusbtn.addEventListener('click',opValidate)
mulbtn.addEventListener('click',opValidate)
divibtn.addEventListener('click',opValidate)
modbtn.addEventListener('click',opValidate)
inverse.addEventListener('click',doInverse)
sqr.addEventListener('click', doSquare)
period.addEventListener('click', function(){
    if(state){
        state = false
    }
    if(calc.getLen() == 0) {
        // distext = '0.'; 
        calc.set('0.');
    }
    else {
        const text = calc.get()
        const temp = text.slice(text.length-1) 
        const res = temp in numsDict

        if(res){
            // distext = distext + this.value
            if(periodInsert(text)) calc.append(this.value);
        }else{
            if(periodInsert(text)){
                let txt = calc.get()
                txt = txt + '0.'
                calc.set(txt)
            }
            
            // temp = temp.slice(0,temp.length-1) + this.value

            // if(periodInsert(txt.slice(0,txt.length-1))){
            //     txt = txt.slice(0,txt.length-1) + this.value
            //     calc.set(txt)
            // }
        }
    
        
    }
})

equal.addEventListener('click',calculate)


funs.addEventListener('click',
    function(){
        console.log(calc.get())
        disp.value = calc.get()
    }
)


clear_all.addEventListener('click', clearAll)
clear_last.addEventListener('click', clearLast)

ms.addEventListener('click', storeMemo)
mr.addEventListener('click', readMemo)
mc.addEventListener('click', clearMemo)
madd.addEventListener('click',addToMemo)
msubt.addEventListener('click', minusToMemo)
showMemo.addEventListener('click', showMemoBtn)

// Logic implementation

function updateDisplay(value){
    console.log(calc.get())
    disp.value = calc.get()
}

function opValidate(){
    const text = calc.get()
    const temp = text.slice(text.length-1) 
    const res = temp in numsDict

    if(state){
        state = false
    }
    
    if(res){
        // distext = distext + this.value
        calc.append(this.value)
    }else if(temp == '.'){
        calc.append('0')
        calc.append(this.value)
    }
    else{
        calc.clearLast()
        calc.append(this.value)
        // distext = distext.slice(0,distext.length-1) + this.value
    }
}

function periodInsert(s){
    let flag = false
    for(let i = s.length-1;i>=0;i--){
        if(s.at(i) == '.'){
            //Do not able to insert 
            alert('Would not be a valid expression!')
            return false;
        }

        if(!(s.at(i) in numsDict)) return true;
        // else if(!(s.at(i) in numsDict)){
        //     flag = false
        // }
    }

    return true
}

function validPeriod(s){
    let flag = false
    for(let i = 0;i<s.length;i++){
        if(s.at(i) == '.'){
            if(!flag) flag = true;
            else{
                alert('Invalid Expression!')
            }
        }
        else if(!(s.at(i) in numsDict)){
            flag = false
        }
    }
}


// Operation Logics
function clearLast(){
    if(state){
        state = false
    }
    calc.clearLast()
}

function clearAll(){
    if(state){
        state = false
    }
    calc.clearAll()
}

function doInverse(){
    if(state){
        state = false
    }
    const ans = (1/calc.evaluate()).toString()
    calc.set(ans)
}

function doSquare(){
    if(state){
        state = false
    }
    const inp = calc.evaluate()
    const ans = (inp * inp).toString()
    calc.set(ans)
}

function storeMemo(){
    calc.setMemo(calc.get())
    // memo.textContent = (calc.getMemo()).toString()
    memoField.style.display = 'block'
}

function readMemo(){
    calc.readMemo()
}

function clearMemo(){
    calc.clearMemo()
    memoField.style.display = 'none'
}

function addToMemo(){
    calc.addToMemo(calc.get())
}

function minusToMemo(){
    calc.minusToMemo()
}

function showMemoBtn(){
    if(memoField.style.display == 'none') memoField.style.display = 'block';
    else memoField.style.display = 'none';
}

function calculate(){
    const ans = calc.evaluate();
    calc.set((ans).toString())
    state = true
}
