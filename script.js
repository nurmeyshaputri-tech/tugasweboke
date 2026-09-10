function selectTemplate(element, name){

    // Hapus pilihan sebelumnya
    document.querySelectorAll(".template").forEach(item => {
        item.classList.remove("selected");

        const oldCheck = item.querySelector(".check-template");
        if(oldCheck){
            oldCheck.remove();
        }
    });

    // Tandai template yang dipilih
    element.classList.add("selected");

    const check = document.createElement("div");
    check.className = "check-template";
    check.innerHTML = "✓ Dipilih";

    element.appendChild(check);

    // Simpan nama template
    localStorage.setItem("template", name);

    // Ubah template aktif
    const activeTemplate =
        document.getElementById("activeTemplate");

    if(activeTemplate){
        activeTemplate.textContent = name;
    }

    // Simpan ke variabel
    window.selectedTemplate = name;
}