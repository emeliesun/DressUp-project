

function myScript(element){
    let $parent = element.closest(".item-row");
    let $grandParent = $parent.closest(".item-list");
    $grandParent.removeChild($parent); 
}
