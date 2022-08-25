/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (err, resp) => {
      if (resp && resp.success){
        const transactions = JSON.parse(localStorage.transactions);
        if (transactions) {
          document.querySelector(`.account[data-id="${transactions.account_id}"]`).classList.remove(".active");
        }
        localStorage.transactions = JSON.stringify({account_id: resp.account.id});
        this.element.reset();
        App.getModal("createAccount").close();
        App.update();
      }else{
        alert(err.error);
      }
    });
  }
}