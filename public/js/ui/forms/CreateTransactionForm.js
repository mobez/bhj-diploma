/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const transactions = JSON.parse(localStorage.transactions);
    let account_id = null;
    if (transactions) {
      account_id = transactions.account_id;
    }
    Account.list(null, (err, resp) => {
      if (resp && resp.success){
        const select = document.getElementById(`${this.element.childNodes[1].value}-accounts-list`);
        select.innerHTML = "";
        resp.data.forEach(a => {
          const option = new Option(a.name,a.id);
          select.add(option);
          if (account_id)
            if (account_id == a.id)
              select.value = account_id
        });
      }else{
        alert(err.error);
      }
    })
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, resp) => {
      if (resp && resp.success){
        this.element.reset();
        if (this.element.childNodes[1].value === "income"){
          App.getModal("newIncome").close();
        }else{
          App.getModal("newExpense").close();
        }
        App.update();
      }else{
        alert(err.error);
      }
    });
  }
}