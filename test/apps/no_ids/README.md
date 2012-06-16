No IDs
======

In this example, we show that explicitly defining IDs for all of your UI components is **_not_** necessary. In many cases when constructing a UI, you may have no interest in tracking a UI component by ID. This is often the case with components that require no events or other interactivity.

The `index.xml` shows that no IDs whatsoever are used in this basic example's construction. Under the hood, a reserved temporary ID prefix, `__alloyId`, is used to allow your element to be included in the generated view hierarchy.

Questions
=========

* Is the reserved prefix `__alloyId` necessary? Can we find a better we to compose the generated view hierarchy without reserving that ID space? 