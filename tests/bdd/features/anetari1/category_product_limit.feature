Feature: Validimi i Limitit të Produkteve për Kategori
  Si administrator i dyqanit
  Unë dua të kufizoj numrin e produkteve për kategori
  Në mënyrë që të mbaj koleksione të organizuara të produkteve

  Background:
    Given Jam i kyçur si administrator
    And Jam në faqen e menaxhimit të produkteve

  Scenario: Shikimi i treguesit të kapacitetit të kategorisë
    When Unë shoh listën e kategorive
    Then Duhet të shoh një tregues kapaciteti për secilën kategori
    And Treguesi duhet të tregojë numrin aktual të produkteve dhe limitin maksimal

  Scenario: Shtimi i një produkti në një kategori nën kapacitet
    Given Kategoria "Trëndafila" ka 45 produkte
    When Unë shtoj një produkt të ri në kategorinë "Trëndafila"
    Then Produkti duhet të shtohet me sukses
    And Kategoria duhet të tregojë 46 \/ 50 produkte 