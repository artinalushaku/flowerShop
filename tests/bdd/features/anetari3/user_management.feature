Feature: Validimi i Menaxhimit të Përdoruesve
  Si administrator i sistemit
  Unë dua të kem validim për menaxhimin e përdoruesve
  Në mënyrë që të kontrolloj qasjen në sistem

  Background:
    Given Jam i kyçur si administrator
    And Jam në faqen e menaxhimit të përdoruesve

  Scenario: Shikimi i listës së përdoruesve
    When Unë shoh listën e përdoruesve
    Then Duhet të shoh të gjithë përdoruesit e regjistruar
    And Duhet të shoh rolin e secilit përdorues

  Scenario: Ndryshimi i rolit të një përdoruesi
    Given Ekziston një përdorues me rolin "user"
    When Unë ndryshoj rolin e përdoruesit në "admin"
    Then Roli i përdoruesit duhet të përditësohet
    And Përdoruesi duhet të ketë qasje në panelin e administratorit

  Scenario: Fshirja e një përdoruesi
    Given Ekziston një përdorues në sistem
    When Unë fshij përdoruesin
    Then Përdoruesi duhet të largohet nga sistemi
    And Nuk duhet të ketë më qasje në llogarinë e tij 