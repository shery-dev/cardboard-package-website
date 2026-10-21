"use client";

import { useState, useEffect, useRef } from "react";
import { Button, FloatingLabel, Textarea } from "flowbite-react";

const selectClass =
  "w-full block py-2.5 px-0 text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-headingTxtColor peer";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahrain", "Bangladesh", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cambodia", "Cameroon", "Canada", "Chad", "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Estonia", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Guinea", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Libya", "Lithuania", "Luxembourg",
  "Madagascar", "Malaysia", "Maldives", "Mali", "Malta", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico",
  "Qatar", "Romania", "Russia", "Rwanda",
  "Saudi Arabia", "Senegal", "Serbia", "Singapore", "Slovakia", "Slovenia", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Tunisia", "Turkey", "Turkmenistan",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Venezuela", "Vietnam",
  "Yemen", "Zambia", "Zimbabwe",
];

const RequestForm = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [productId, setProductId] = useState("");
  const [productsLoading, setProductsLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef(null);

  const filteredCountries = countrySearch.trim()
    ? COUNTRIES.filter((c) => c.toLowerCase().includes(countrySearch.toLowerCase()))
    : COUNTRIES;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryRef.current && !countryRef.current.contains(e.target)) setCountryOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetch("/api/v1/site-categories")
      .then((res) => res.json())
      .then((json) => setCategories(Array.isArray(json?.data) ? json.data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!categoryId) {
      setProducts([]);
      setProductId("");
      return;
    }
    setProductId("");
    setProductsLoading(true);
    fetch(`/api/v1/getProducts/${categoryId}`)
      .then((res) => res.json())
      .then((json) => setProducts(Array.isArray(json?.data) ? json.data : []))
      .catch(() => setProducts([]))
      .finally(() => setProductsLoading(false));
  }, [categoryId]);

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
  };

  const handleProductChange = (e) => {
    setProductId(e.target.value);
  };

  const hasCategory = Boolean(categoryId);
  const hasProduct = Boolean(productId);

  return (
    <form className="flex flex-col gap-2.5">
      <FloatingLabel variant="standard" label="Name" />
      <FloatingLabel variant="standard" label="Email" />
      <FloatingLabel variant="standard" label="Number" inputProps={{ type: "tel", placeholder: "Phone number" }} />

      <div className="flex flex-col gap-1" ref={countryRef}>
        <label htmlFor="country_search" className="text-headingTxtColor text-sm font-medium">
          Country
        </label>
        <input
          id="country_search"
          type="text"
          autoComplete="off"
          placeholder={country || "Search or select country"}
          value={countryOpen ? countrySearch : country}
          onChange={(e) => {
            setCountrySearch(e.target.value);
            if (!countryOpen) setCountryOpen(true);
            if (!e.target.value) setCountry("");
          }}
          onFocus={() => setCountryOpen(true)}
          className={selectClass}
        />
        {countryOpen && (
          <ul className="mt-0.5 max-h-40 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-lg z-10 text-sm">
            {filteredCountries.length === 0 ? (
              <li className="px-3 py-2 text-gray-500">No country found</li>
            ) : (
              filteredCountries.map((c) => (
                <li
                  key={c}
                  role="option"
                  aria-selected={country === c}
                  className={`px-3 py-2 cursor-pointer hover:bg-headingTxtColor/10 ${country === c ? "bg-headingTxtColor/10 text-headingTxtColor" : "text-gray-700"}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setCountry(c);
                    setCountrySearch("");
                    setCountryOpen(false);
                  }}
                >
                  {c}
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="category_select" className="text-headingTxtColor text-sm font-medium">
          What category are you interested in?
        </label>
        <select
          id="category_select"
          className={selectClass}
          value={categoryId}
          onChange={handleCategoryChange}
        >
          <option value="">Choose a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.cardboardname}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="product_select" className="text-headingTxtColor text-sm font-medium">
          What product are you interested in?
        </label>
        <select
          id="product_select"
          className={`${selectClass} ${!hasCategory ? "opacity-60 cursor-not-allowed" : ""}`}
          value={productId}
          onChange={handleProductChange}
          disabled={!hasCategory}
          aria-disabled={!hasCategory}
        >
          <option value="">
            {!hasCategory
              ? "Choose a category first"
              : productsLoading
                ? "Loading products..."
                : products.length === 0
                  ? "No products in this category"
                  : "Choose a product"}
          </option>
          {products.map((prod) => (
            <option key={prod._id} value={prod._id}>
              {prod.cardboardname}
            </option>
          ))}
        </select>
      </div>

      {hasProduct && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <FloatingLabel
              variant="standard"
              label="Length"
              inputProps={{ type: "number", min: "0", placeholder: "Length" }}
            />
            <FloatingLabel
              variant="standard"
              label="Width"
              inputProps={{ type: "number", min: "0", placeholder: "Width" }}
            />
            <FloatingLabel
              variant="standard"
              label="Height"
              inputProps={{ type: "number", min: "0", placeholder: "Height" }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <FloatingLabel
              variant="standard"
              label="Quantity"
              inputProps={{ type: "number", min: "0", placeholder: "Quantity" }}
            />
          </div>
        </>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="details" className="text-headingTxtColor text-sm font-medium">
          <span className="font-bold">Add packaging details (Optional)</span>
        </label>
        <Textarea id="details" placeholder="Enter details..." rows={2} className="text-sm min-h-[60px]" />
      </div>

      <Button
        type="submit"
        className="w-full sm:w-auto bg-mainBgColor hover:bg-mainBgHover text-headingTxtColor font-semibold border-0 focus:ring-mainBgColor/50"
      >
        Send Request
      </Button>
    </form>
  );
};

export default RequestForm;
