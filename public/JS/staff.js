function checkform(id) {
    
    var edit_salary=$("#edit_salary_"+id).val();
    if(isNaN(edit_salary)==true||parseInt(edit_salary)<=1000){
        $("#btn_edit_" + id).attr("disabled", true);
        return;
    }
    console.log("#btn_" + id);

    $("#btn_edit_" + id).attr("disabled", false);
}