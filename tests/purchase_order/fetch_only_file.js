
import "./libs/shim/urijs.js";

export let options = { maxRedirects: 4 };

const Request = Symbol.for("request");
postman[Symbol.for("initial")]({
  options,
  collection: {
    "D-url": "https://dev-ml.farmartos.com/"
  }
});

export default function() {
  // Define the number of virtual users and duration
  const VUs = 10;
  const duration = 10; // in seconds

  // Loop to simulate VUs
  for (let i = 0; i < VUs; i++) {
    // Each VU will run the requests in sequence
    postman[Request]({
      name: "fetch_states",
      id: "6e57e5d1-7e6c-4836-b5c5-54b981d6fc8f",
      method: "GET",
      address: "{{D-url}}v1/location/states",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThmM2ZlN2E4Njg3YmM3NmQ2MmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3NzI4IiwiaWF0IjoxNzI5MDc4OTAzfQ.y3VoDX86BhEqXIHiqp8Ajd9NINDnkA3koSxS_wLfMoQ",
            "if-none-match": 'W/"644-HCkQBctqfcLx2reiaTtwC/jXacM"',
            origin: "https://fmt-dev-ml.web.app",
            priority: "u=1, i",
            referer: "https://fmt-dev-ml.web.app/",
            "sec-ch-ua":
              '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "user-agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
      }
    });

    // Add a delay to simulate duration
    if (i < VUs - 1) {
      setTimeout(() => {}, duration * 1000 / VUs);
    }
  }

  postman[Request]({
    name: "fetch_all_pa",
    id: "e59378bb-2bc1-44a1-8283-d4e7625701e0",
    method: "GET",
    address: "{{D-url}}v1/campaign/fetch_all_pa",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThmM2ZlN2E4Njg3YmM3NmQ2MmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3NzI4IiwiaWF0IjoxNzI5MDc4OTAzfQ.y3VoDX86BhEqXIHiqp8Ajd9NINDnkA3koSxS_wLfMoQ",
      "if-none-match": 'W/"28c4-JH11nzJsbIiqBsrE5ZMfHVXlJYQ"',
      origin: "https://fmt-dev-ml.web.app",
      priority: "u=1, i",
      referer: "https://fmt-dev-ml.web.app/",
      "sec-ch-ua":
        '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
    }
  });

  postman[Request]({
    name: "tab_frequency_api",
    id: "3dcbf833-cbfd-496b-bd89-56600890a825",
    method: "GET",
    address:
      "{{D-url}}v1/master_sample/tab_frequency?business_type=3&pa_ids=109,176&rpm_ids=253&state_ids=5&po_created_from_date=2024-10-23&po_created_to_date=2024-10-24",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTdjMDAwMjU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiYzhiMzdlMWEwNmE3ZmMxNjk2MWM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmY3YjI4IiwiaWF0IjoxNzI3MTgyODc5fQ._uBipw5E3fkcQ0_Mm_sNznC1UQzwzAozmlxIBqEMkyU",
      "if-none-match": 'W/"687c-acr/X1WMjBu9p5Q1SIXzxy376rw"',
      origin: "https://fmt-dev-ml.web.app",
      priority: "u=1, i",
      referer: "https://fmt-dev-ml.web.app/",
      "sec-ch-ua":
        '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
  });

  postman[Request]({
    name: "api for fetching details of po for (sample created, po finalised)",
    id: "db68808d-12c9-4fa9-8276-f366fe830c92",
    method: "GET",
    address: "{{D-url}}v1/master_sample/po_to_approve_details?lot_id=6715",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMjU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZjg5M2ZlNmEzNmM3OGMzNmM2N2M2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmY3YzI4IiwiaWF0IjoxNzI1ODYzNzg2fQ.DdMZAXxYGAzAEm491l0PoSrEdkgg32TnxmI54tJbcdI"
    }
  });

  postman[Request]({
    name: "api for showing po details on MAP PO modal",
    id: "bcc6538d-8e37-4be4-82be-fbceb8956718",
    method: "GET",
    address:
      "{{D-url}}v1/master_sample/po_mapping_transaction_details?lot_id=6354&buyer_order_id=264",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMjU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZjg5M2ZlNmEzNmM3OGMzNmM2N2M2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmY3YzI4IiwiaWF0IjoxNzI1ODYzNzg2fQ.DdMZAXxYGAzAEm491l0PoSrEdkgg32TnxmI54tJbcdI"
    }
  });

  postman[Request]({
    name: "api for getting all po details",
    id: "d34a49b1-6bcc-4baf-ac9c-f35f8f92abc4",
    method: "GET",
    address: "{{D-url}}v3/master_sample/detail?lot_id=550",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMjU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZjg5M2ZlNmEzNmM3OGMzNmM2N2M2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmY3YzI4IiwiaWF0IjoxNzI1ODYzNzg2fQ.DdMZAXxYGAzAEm491l0PoSrEdkgg32TnxmI54tJbcdI"
    }
  });

  postman[Request]({
    name: "fetch_all_rpm",
    id: "3646cc1d-6939-4f48-9fc5-1469f6ed1d4d",
    method: "GET",
    address: "{{D-url}}v1/users/fetch_all_rpm",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMjU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZjg5M2ZlNmEzNmM3OGMzNmM2N2M2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmY3YzI4IiwiaWF0IjoxNzI1ODYzNzg2fQ.DdMZAXxYGAzAEm491l0PoSrEdkgg32TnxmI54tJbcdI"
    },
    auth(config, Var) {
      config.headers.Authorization =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMjU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZjg5M2ZlNmEzNmM3OGMzNmM2N2M2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmY3YzI4IiwiaWF0IjoxNzI5MjQ0NzY0fQ.TxnXRGczgLGX1_ivc5QSqR9Ly0523iaAoEU2uxSV-wk";
    }
  });

  postman[Request]({
    name: "fetch_all_districts",
    id: "d016d4c1-3eab-49d7-a9b9-29ba4b58997f",
    method: "GET",
    address: "{{D-url}}v1/location/districts?master_state_id=2",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThmM2ZlN2E4Njg3YmM3NmQ2MmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3NzI4IiwiaWF0IjoxNzI5MDc4OTAzfQ.y3VoDX86BhEqXIHiqp8Ajd9NINDnkA3koSxS_wLfMoQ",
      origin: "https://fmt-dev-ml.web.app",
      priority: "u=1, i",
      referer: "https://fmt-dev-ml.web.app/",
      "sec-ch-ua":
        '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
    }
  });

  postman[Request]({
    name: "fetch_lot_details",
    id: "9200cd43-7a1f-440e-a40f-da0323cab873",
    method: "GET",
    address: "{{D-url}}v3/master_sample/detail?lot_id=6690",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThmM2ZlN2E4Njg3YmM3NmQ2MmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3NzI4IiwiaWF0IjoxNzI5MDc4OTAzfQ.y3VoDX86BhEqXIHiqp8Ajd9NINDnkA3koSxS_wLfMoQ",
      "if-none-match": 'W/"5f4-ELmUb2CPj3uoNvNO4ohOObVXPrA"',
      origin: "https://fmt-dev-ml.web.app",
      priority: "u=1, i",
      referer: "https://fmt-dev-ml.web.app/",
      "sec-ch-ua":
        '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
    }
  });

  postman[Request]({
    name: "fetch_purchase_order_details",
    id: "eb9dff98-f44f-4e08-8c7a-a0fb969b4b5a",
    method: "GET",
    address: "{{D-url}}v1/purchase_order/4227",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThmM2ZlN2E4Njg3YmM3NmQ2MmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3NzI4IiwiaWF0IjoxNzI5MDc4OTAzfQ.y3VoDX86BhEqXIHiqp8Ajd9NINDnkA3koSxS_wLfMoQ",
      "if-none-match": 'W/"11a9-ldMDgA/DHLxY+gz3VHyKAWt0kxw"',
      origin: "https://fmt-dev-ml.web.app",
      priority: "u=1, i",
      referer: "https://fmt-dev-ml.web.app/",
      "sec-ch-ua":
        '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
    }
  });

  postman[Request]({
    name: "get_so_for_mapping_api",
    id: "df8d0b5c-82b9-409e-b3cb-18a0ae3d7c83",
    method: "GET",
    address: "{{D-url}}v1/buyer/order/4227",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThmM2ZlN2E4Njg3YmM3NmQ2MmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3NzI4IiwiaWF0IjoxNzI5MDc4OTAzfQ.y3VoDX86BhEqXIHiqp8Ajd9NINDnkA3koSxS_wLfMoQ",
      "if-none-match": 'W/"367-yCl+TGYpfGOeLcHFBXaq2Ep89yU"',
      origin: "https://fmt-dev-ml.web.app",
      priority: "u=1, i",
      referer: "https://fmt-dev-ml.web.app/",
      "sec-ch-ua":
        '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
    }
  });

  postman[Request]({
    name: "get_doc_for_approval",
    id: "a1be0d0c-dabb-41bf-ad9e-1923e24febd0",
    method: "GET",
    address: "{{D-url}}v1/purchase_order/doc_approval/4227",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThmM2ZlN2E4Njg3YmM3NmQ2MmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3NzI4IiwiaWF0IjoxNzI5MDc4OTAzfQ.y3VoDX86BhEqXIHiqp8Ajd9NINDnkA3koSxS_wLfMoQ",
      "if-none-match": 'W/"12fe-SllhAmXmfhkvlTvC804dWYwe4no"',
      origin: "https://fmt-dev-ml.web.app",
      priority: "u=1, i",
      referer: "https://fmt-dev-ml.web.app/",
      "sec-ch-ua":
        '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
    }
  });

  postman[Request]({
    name: "fetch_requested_payment",
    id: "e7dafd2e-236e-4e50-8c65-78e836b95bc2",
    method: "GET",
    address: "{{D-url}}v4/payment/requested_payment?po_id=4227&payment_for=1",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThmM2ZlN2E4Njg3YmM3NmQ2MmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3NzI4IiwiaWF0IjoxNzI5MDc4OTAzfQ.y3VoDX86BhEqXIHiqp8Ajd9NINDnkA3koSxS_wLfMoQ",
      "content-type": "application/json",
      "if-none-match": 'W/"3a-UajKe9IST0CnSBxHtOeHOKDgghk"',
      origin: "https://fmt-dev-ml.web.app",
      priority: "u=1, i",
      referer: "https://fmt-dev-ml.web.app/",
      "sec-ch-ua":
        '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
    }
  });

  postman[Request]({
    name: "fetch_deduction_reasons_for_retailer",
    id: "6d186c99-b482-448a-bf71-fd0a89d23b57",
    method: "GET",
    address: "{{D-url}}v1/payment/deduction_reasons/retailer",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThmM2ZlN2E4Njg3YmM3NmQ2MmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3NzI4IiwiaWF0IjoxNzI5MDc4OTAzfQ.y3VoDX86BhEqXIHiqp8Ajd9NINDnkA3koSxS_wLfMoQ",
      "content-type": "application/json",
      "if-none-match": 'W/"89-WNgdLYT1wwE0YBuHN+bU9Ru/WBo"',
      origin: "https://fmt-dev-ml.web.app",
      priority: "u=1, i",
      referer: "https://fmt-dev-ml.web.app/",
      "sec-ch-ua":
        '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
    }
  });

  postman[Request]({
    name: "fetch_payment_rejection_reasons",
    id: "596a5643-8645-428e-a36f-5652323ad5f1",
    method: "GET",
    address: "{{D-url}}v4/payment/rejection_reasons?rejection_for=1",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThmM2ZlN2E4Njg3YmM3NmQ2MmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3NzI4IiwiaWF0IjoxNzI5MDc4OTAzfQ.y3VoDX86BhEqXIHiqp8Ajd9NINDnkA3koSxS_wLfMoQ",
      "content-type": "application/json",
      "if-none-match": 'W/"c9-R+5vLQx/PwdFAjtUSUVZbk5V1pw"',
      origin: "https://fmt-dev-ml.web.app",
      priority: "u=1, i",
      referer: "https://fmt-dev-ml.web.app/",
      "sec-ch-ua":
        '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
    }
  });

  postman[Request]({
    name: "fetch_gst_payment_detail",
    id: "f20e6bc3-9362-4f42-8393-8abe1b7b97f1",
    method: "GET",
    address: "{{D-url}}v4/payment/gst/details?po_id=4227",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThmM2ZlN2E4Njg3YmM3NmQ2MmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3NzI4IiwiaWF0IjoxNzI5MDc4OTAzfQ.y3VoDX86BhEqXIHiqp8Ajd9NINDnkA3koSxS_wLfMoQ",
      "content-type": "application/json",
      "if-none-match": 'W/"ec-yUnhSyb8KD7IOYe9o57Sh6zGAoA"',
      origin: "https://fmt-dev-ml.web.app",
      priority: "u=1, i",
      referer: "https://fmt-dev-ml.web.app/",
      "sec-ch-ua":
        '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
    }
  });

  postman[Request]({
    name: "fetch_retailer_payment_detail",
    id: "ad5b09a4-3181-436c-a582-dec5110903ef",
    method: "GET",
    address: "{{D-url}}v4/payment/retailer/details?po_id=4227",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThmM2ZlN2E4Njg3YmM3NmQ2MmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3NzI4IiwiaWF0IjoxNzI5MDc4OTAzfQ.y3VoDX86BhEqXIHiqp8Ajd9NINDnkA3koSxS_wLfMoQ",
      "content-type": "application/json",
      "if-none-match": 'W/"345-YWW8APkoE6g4cR5ArY4eXQDyNqE"',
      origin: "https://fmt-dev-ml.web.app",
      priority: "u=1, i",
      referer: "https://fmt-dev-ml.web.app/",
      "sec-ch-ua":
        '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
    }
  });

  postman[Request]({
    name: "fetch_deduction_reasons_for_transport",
    id: "d6b02740-9f11-474b-9bca-c188ef55a78d",
    method: "GET",
    address: "{{D-url}}v1/payment/deduction_reasons/transport",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThmM2ZlN2E4Njg3YmM3NmQ2MmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3NzI4IiwiaWF0IjoxNzI5MDc4OTAzfQ.y3VoDX86BhEqXIHiqp8Ajd9NINDnkA3koSxS_wLfMoQ",
      "content-type": "application/json",
      "if-none-match": 'W/"9c-NY2FrY9xkrYd/dvZvYm4ks2tSSg"',
      origin: "https://fmt-dev-ml.web.app",
      priority: "u=1, i",
      referer: "https://fmt-dev-ml.web.app/",
      "sec-ch-ua":
        '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
    }
  });

  postman[Request]({
    name: "fetch_transport_payment_detail",
    id: "45e73ad9-59ed-43a6-99e1-175e994d2ac1",
    method: "GET",
    address: "{{D-url}}v4/payment/transport/details?po_id=4227",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTc4MDEwMTU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiZThmM2ZlN2E4Njg3YmM3NmQ2MmM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmQ3NzI4IiwiaWF0IjoxNzI5MDc4OTAzfQ.y3VoDX86BhEqXIHiqp8Ajd9NINDnkA3koSxS_wLfMoQ",
      "content-type": "application/json",
      "if-none-match": 'W/"532-DLX46VRav9eJxqc0NDV8ypP44XU"',
      origin: "https://fmt-dev-ml.web.app",
      priority: "u=1, i",
      referer: "https://fmt-dev-ml.web.app/",
      "sec-ch-ua":
        '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
    }
  });

  postman[Request]({
    name: "listing_api",
    id: "4d3a586d-7887-4132-bcf8-d8bf0af04094",
    method: "GET",
    address:
      "{{D-url}}v5/master_sample/list?page=1&limit=50&business_type=3&tab_type_id=8&po_created_from_date=2024-08-24&po_created_to_date=2024-08-24",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbmNyeXB0ZWRfdG9rZW4iOiJkMzA1NjM2YTk0YmFlNmI2NjAzNThiOTk5ODZmYTNhYjNiN2Q4OTdjMDAwMjU2ZDAwNDc3NTQxOGVjYzAzMDZkYWJkOGUxNDJhNmIyZDZiYzhiMzdlMWEwNmE3ZmMxNjk2MWM2YjAzZjg5NDY4NDk0YjM1NDYyYzAzZmE1ZGE5MTJkZmY3YjI4IiwiaWF0IjoxNzI3MTgyODc5fQ._uBipw5E3fkcQ0_Mm_sNznC1UQzwzAozmlxIBqEMkyU",
      "if-none-match": 'W/"687c-acr/X1WMjBu9p5Q1SIXzxy376rw"',
      origin: "https://fmt-dev-ml.web.app",
      priority: "u=1, i",
      referer: "https://fmt-dev-ml.web.app/",
      "sec-ch-ua":
        '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
  });

}