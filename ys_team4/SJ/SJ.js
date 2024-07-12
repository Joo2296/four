// DOM이 완전히 로드된 후 실행될 함수를 정의합니다.
document.addEventListener("DOMContentLoaded", function () {
  // 필요한 DOM 요소들을 선택하여 변수에 할당합니다.
  const hoverImage = document.querySelector(".hohover.hover");
  const rightMenuBox = document.querySelector(".right_menu_box");
  const menuContainer = document.querySelector(".menu-container");
  const lowPriceBtn = document.getElementById("lowPrice");
  const highPriceBtn = document.getElementById("highPrice");
  const foodContainer = document.querySelector(".food");
  const iframeContainer = document.getElementById("iframeContainer");
  const productIframe = document.getElementById("productIframe");
  const closeIframeBtn = document.getElementById("closeIframe");
  
  // 메뉴를 표시하거나 숨기는 함수를 정의합니다.
  function toggleMenu(show) {
    rightMenuBox.style.display = show ? "block" : "none";
  }

  // 호버 이미지와 오른쪽 메뉴 박스에 마우스 오버 이벤트 리스너를 추가합니다.
  [hoverImage, rightMenuBox].forEach((el) =>
    el.addEventListener("mouseover", () => toggleMenu(true))
  );
  // 메뉴 컨테이너와 오른쪽 메뉴 박스에 마우스 리브 이벤트 리스너를 추가합니다.
  [menuContainer, rightMenuBox].forEach((el) =>
    el.addEventListener("mouseleave", () => toggleMenu(false))
  );
  // 메뉴 컨테이너 클릭 시 메뉴 토글 기능을 추가합니다.
  menuContainer.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu(rightMenuBox.style.display !== "block");
  });

  // 메뉴 외부 클릭 시 메뉴를 닫는 이벤트 리스너를 추가합니다.
  document.addEventListener("click", (e) => {
    if (!menuContainer.contains(e.target)) toggleMenu(false);
  });

  // 아이콘 클릭 이벤트를 처리하는 함수를 정의합니다.
  function handleIconClick(e) {
    if (e.target.classList.contains("fa-suitcase")) {
      e.preventDefault();
      const icon = e.target;
      // 클릭된 아이콘의 데이터 속성에서 상품 정보를 가져옵니다.
      const productUrl = icon.closest("a").href;
      const productName = icon.dataset.productName;
      const productDesc = icon.dataset.productDesc;
      const productPrice = icon.dataset.productPrice;
      const productImage = icon.dataset.productImage;

      // iframe에 표시할 HTML 내용을 생성합니다.
      const iframeContent = `
          <html>
            <head>
              <link rel="stylesheet" href="iframe-styles.css">
            </head>
            <body>
              <h2>옵션 선택</h2>
              <p>${productName}</p>
              <img src="${productImage}" alt="${productName}">
              <p>${productDesc}</p>
              <p>가격: ${productPrice}</p>
              <p>색상:</p>
              <div>
                <span class="color-option" style="background-color: #000;"></span>
                <span class="color-option" style="background-color: #333;"></span>
                <span class="color-option" style="background-color: #8B4513;"></span>
              </div>
              <p>[필수] 옵션을 선택해 주세요</p>
              <p style="color: red;">※ 컵보다 박스를 선택하시면 아래에 상품이 추가됩니다.</p>
              <p>총 상품금액(수량): 0 (0개)</p>
              <div class="buttons">
                <button>바로구매하기</button>
                <button>장바구니 담기</button>
              </div>
            </body>
          </html>
        `;

      // 생성한 HTML 내용을 iframe에 설정하고 iframe 컨테이너를 표시합니다.
      productIframe.srcdoc = iframeContent;
      iframeContainer.style.display = "block";
    }
  }

  // iframe을 닫는 함수를 정의합니다.
  function closeIframe() {
    iframeContainer.style.display = "none";
    productIframe.srcdoc = "";
  }

  // 문서 전체에 아이콘 클릭 이벤트 리스너를 추가합니다.
  document.body.addEventListener("click", handleIconClick);
  // iframe 닫기 버튼에 이벤트 리스너를 추가합니다.
  closeIframeBtn.addEventListener("click", closeIframe);

  // 상품을 가격순으로 정렬하는 함수를 정의합니다.
  function sortProducts(ascending = true) {
      console.log("Sorting products..."); // 정렬 시작 로그
      const foodImg = foodContainer.querySelector(".food_img");
      if (!foodImg) {
          console.log("food_img not found"); // food_img 요소가 없을 경우 로그
          return;
      }

      const products = Array.from(foodImg.children);
      console.log(`Found ${products.length} products`); // 찾은 상품 수 로그

      products.sort((a, b) => {
          // 가격을 추출하는 내부 함수를 정의합니다.
          const getPrice = el => {
              const priceEl = el.querySelector("p:last-child");
              if (!priceEl) {
                  console.log("Price element not found", el); // 가격 요소를 찾지 못한 경우 로그
                  return 0;
              }
              const priceText = priceEl.textContent.trim();
              const price = parseInt(priceText.replace(/[^\d]/g, ''));
              console.log(`Extracted price: ${price} from ${priceText}`); // 추출한 가격 로그
              return price;
          };
          const priceA = getPrice(a);
          const priceB = getPrice(b);
          return ascending ? priceA - priceB : priceB - priceA;
      });

      // 정렬된 상품들을 다시 DOM에 추가합니다.
      foodImg.innerHTML = "";
      products.forEach((product) => {
          foodImg.appendChild(product);
          const icon = product.querySelector(".fa-suitcase");
          if (icon) icon.closest("a").addEventListener("click", handleIconClick);
      });
      console.log("Sorting completed"); // 정렬 완료 로그
  }

  // 낮은 가격순 정렬 버튼에 이벤트 리스너를 추가합니다.
  if (lowPriceBtn) {
      lowPriceBtn.addEventListener("click", (e) => {
          e.preventDefault();
          console.log("Low price button clicked"); // 버튼 클릭 로그
          sortProducts(true);
      });
  } else {
      console.log("Low price button not found"); // 버튼을 찾지 못한 경우 로그
  }

  // 높은 가격순 정렬 버튼에 이벤트 리스너를 추가합니다.
  if (highPriceBtn) {
      highPriceBtn.addEventListener("click", (e) => {
          e.preventDefault();
          console.log("High price button clicked"); // 버튼 클릭 로그
          sortProducts(false);
      });
  } else {
      console.log("High price button not found"); // 버튼을 찾지 못한 경우 로그
  }

  // 페이지 로드 후 1초 뒤에 초기 정렬을 수행합니다. (동적 로딩된 콘텐츠 대응)
  setTimeout(() => {
      console.log("Performing initial sort"); // 초기 정렬 시작 로그
      sortProducts(true);
  }, 1000);
});