/** @type {HTMLImageElement[]} */
const drag_images = document.querySelectorAll('.drag-section > img');
/** @type {HTMLDivElement[]} */
const drop_elems = document.querySelectorAll('.drop-elem');

drag_images.forEach((img) => {
    img.draggable = true;
    img.ondragstart = (e) => {
        e.dataTransfer.setData('elemId', e.target.id);
    };
});

drop_elems.forEach((elem) => {
    elem.ondragover = (e) => e.preventDefault();
    elem.ondrop = (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('elemId');

        /** @type {HTMLElement} */
        let t = e.target;

        if (t) {
            if (t.nodeName === 'IMG') t = t.parentElement; // Prevent images to be dropped into another image
            t.replaceChildren(document.getElementById(data).cloneNode()) = ''; // Remove previous element
        }
    };
});
