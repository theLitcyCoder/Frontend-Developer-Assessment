import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ThemePalette } from '@angular/material/core';

interface Product {
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  stock: string;
  price: number;
  images: string[];
}

interface ChipColor {
  name: string;
  color: ThemePalette;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['id', 'title', 'description']; // Add more column names as needed
  displayedProducts: Product[] = [];
  sortedData: Product[] = [];
  filteredProducts: Product[] = [];
  totalItems: number = 0;
  currentPage = 1;
  pageSize = 8;
  selectedChip!: string;
  value = '';
  value1: number | undefined;
  value2: number | undefined;
  firstProduct: Product | undefined;
  secondProduct: Product | undefined;
  firstProductArray: Product | undefined;
  secondProductArray: Product | undefined;
  comparisonResult: boolean | undefined;
  comparisonResultArray: boolean | undefined;
  datamanipulationresult1: any;
  datamanipulationresult2: any;

  constructor(private http: HttpClient) {
    this.sortedData = this.products.slice();
  }

  ngOnInit(): void {
    this.http.get<any>('https://dummyjson.com/products').subscribe(
      (response) => {
        this.products = response.products;
        this.totalItems = this.products.length;
        this.sortedData = this.products.slice();
        this.searchProducts();
        this.updateDisplayedProducts();
        this.datamanipulation();
        for (const product of this.products) {
          const jsonData = {
            title: product.title,
            price: product.price,
            images: product.images,
          };
          console.log(JSON.stringify(jsonData));
        }
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  // sort the cards based on sorting categories
  sortData(sort: Sort) {
    const data = this.products.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      // this.selectedChip = '';
      return;
    }

    this.selectedChip = sort.active;

    // this.sortedData = data.sort((a, b) => {
    //   const isAsc = sort.direction === 'asc';
    //   return compare((a as any)[sort.active], (b as any)[sort.active], isAsc);
    // });

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title':
          return compare(a.title, b.title, isAsc);
        case 'category':
          return compare(a.category, b.category, isAsc);
        case 'stock':
          return compare(a.stock, b.stock, isAsc);
        case 'price':
          return compare(a.price, b.price, isAsc);
        default:
          return 0;
      }
    });
    this.updateDisplayedProducts();
  }

  // search for a product
  searchProducts(): void {
    const query = this.value.toLowerCase().trim();

    if (query === '') {
      this.filteredProducts = this.products.slice();
    } else {
      this.filteredProducts = this.products.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    this.totalItems = this.filteredProducts.length;
    this.sortedData = this.filteredProducts.slice();
    this.updateDisplayedProducts();
  }

  // updates the information on the cards when displayed
  updateDisplayedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const sortedData = this.sortedData.slice(); // Make a copy of the sortedData array

    const sortedAndFilteredData = sortedData.filter((product) => {
      // Apply your filtering logic here, e.g., check if the product matches the search criteria
      return product.title.toLowerCase().includes(this.value.toLowerCase());
    });

    this.displayedProducts = sortedAndFilteredData.slice();

    // Perform sorting on the displayedProducts array
    this.displayedProducts.sort((a, b) => {
      const isAsc = this.selectedChip === 'title' ? true : false;
      return compare(
        (a as any)[this.selectedChip],
        (b as any)[this.selectedChip],
        isAsc
      );
    });

    // Update the totalItems based on the filtered and sorted data
    this.totalItems = this.displayedProducts.length;

    // Slice the displayedProducts array based on the current page and page size
    this.displayedProducts = this.displayedProducts.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  // displays the next set of cards based on number of items to be shown
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updateDisplayedProducts();
  }

  selectChip(chip: string) {
    this.selectedChip = chip;
  }

  // Equalities section
  compareProducts(): void {
    if (this.firstProduct && this.secondProduct) {
      this.comparisonResult = this.is_equal_object(
        this.firstProduct,
        this.secondProduct
      );
    } else {
      this.comparisonResult = undefined;
    }
  }

  is_equal_object(obj_1: Product, obj_2: Product) {
    // Get the keys of both objects
    const keys_1 = Object.keys(obj_1) as (keyof Product)[];
    const keys_2 = Object.keys(obj_2) as (keyof Product)[];

    // Check if the number of keys is the same
    if (keys_1.length !== keys_2.length) {
      return false;
    }

    // Compare the values for each key
    for (let key of keys_1) {
      if (obj_1[key] !== obj_2[key]) {
        return false;
      }
    }

    // Objects are equal
    return true;
  }

  // Array equals
  is_equal_array(arr_1: any[], arr_2: any[]) {
    // Example comparison logic
    if (arr_1.length !== arr_2.length) {
      return false;
    }
    console.log('f', arr_1);
    for (let i = 0; i < arr_1.length; i++) {
      if (arr_1[i] !== arr_2[i]) {
        return false;
      }
    }

    return true;
  }

  compareProductsArray() {
    if (this.firstProductArray && this.secondProductArray) {
      this.comparisonResultArray = this.is_equal_array(
        Object.values(this.firstProductArray),
        Object.values(this.secondProductArray)
      );
    } else {
      this.comparisonResultArray = undefined;
    }
  }

  // Data manipulation
  datamanipulation() {
    let array_1 = [1, 2, 3, 4];
    const array_2 = [1, 2, 3, 4];

    for (let i = 0; i < array_1.length; i++) {
      array_1[i] = i + 5;
      array_2[i] = i + 5;
    }
    this.datamanipulationresult1 = array_1;
    this.datamanipulationresult2 = array_2;
    console.log(array_1); // Output: [5, 6, 7, 8]
    console.log(array_2); // Output: [5, 6, 7, 8]
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
