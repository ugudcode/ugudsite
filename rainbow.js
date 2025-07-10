console.log("hello world")

//let element = document.getElementById("tswcontainer")
element.style.opacity = 1
let angle = 0;
let shouldrainbow = true;
console.log(element)
function onframe() {
    angle += 1;
    let string = "hsl(" + angle + ", 100%, 50%)"
    if (shouldrainbow) {
        element.style.backgroundColor = string
    }
    console.log(string)
    requestAnimationFrame(onframe)
}
onframe()

function start_rainbow() {
    shouldrainbow = true;

}

function onlmb (event) {
    shouldrainbow = false;
    element.style.backgroundColor = input.value;
    setTimeout(start_rainbow, 1000)
}
