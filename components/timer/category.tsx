import CategoryList from "./category-list";

export default function Category() {
  return (
    <div className="flex">
      <CategoryList text="Pose" query="pose" />
      <CategoryList text="Hand" query="hand" />
      <CategoryList text="Face" query="face" />
      <CategoryList text="Animal" query="animal" />
    </div>
  );
}
