var a = newValue;

var max = a[0].start;
var min = a[0].start;
for (var i = 0; i < a.length; i++) {
  if (a[i].start > max) {
   max = a[i].start;
} else if (a[i].start < min) {
   min = a[i].start;
  }
}
console.log(max);
console.log(min);
