(_=>_())(()=>{
const msg = detail => () => { window.dispatchEvent(new CustomEvent('__AA__EvEnT', {detail})) };
window.focus = msg('focus');
});
