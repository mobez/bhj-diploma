/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (element){
      this.element = element;
      this.update();
      this.registerEvents();
    }else{
      alert("Элемент не существует!");
    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.querySelector(".create-account").onclick = e => {
      App.getModal("createAccount").open();
    }
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    Account.list(null, (err, resp) => {
      if (resp && resp.success){
        this.clear();
        this.renderItem(resp.data);
      }else{
        alert(err.error);
      }
    });
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    this.element.querySelectorAll("li.account").forEach(li =>{
      li.remove();
    });
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const transactions = JSON.parse(localStorage.transactions);
    if (transactions) {
      const elementOld = this.element.querySelector(`[data-id="${transactions.account_id}"]`);
      if (elementOld)
        elementOld.classList.remove("active");
    }
    if (element){
      element.classList.add("active");
      App.showPage( 'transactions', { account_id: element.dataset.id });
      localStorage.setItem("elementTransaction", JSON.stringify({element: element}));
      let select = document.getElementById("income-accounts-list");
      if (select)
        select.value = element.dataset.id;
      select = document.getElementById("expense-accounts-list");
      if (select)
        select.value = element.dataset.id;
    }else{
      localStorage.transactions = null;
    }
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    return `<li class="account" data-id="${item.id}">
              <a href="#">
                <span>${item.name}</span>
                <span>${(item.sum).toLocaleString('en-US')} ₽</span>
              </a>
            </li>`;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    const transactions = JSON.parse(localStorage.transactions);
    let account_id = null;
    if (transactions) {
      account_id = transactions.account_id
    }
    let elementId = null;
    data.forEach(item => {
      this.element.insertAdjacentHTML("beforeend",this.getAccountHTML(item));
      const elementId = this.element.querySelector(`[data-id="${item.id}"]`);
      if (elementId){
        if (account_id)
          if (item.id == account_id){
            elementId.classList.add("active");
        }
        elementId.childNodes[1].onclick = e => {
          e.preventDefault();
          this.onSelectAccount(elementId);
        };
      }
    });
  }
}
