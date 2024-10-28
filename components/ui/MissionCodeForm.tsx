"use client";

import { redirect } from "next/navigation";

const MissionCodeForm = () => (
  <form
    onSubmit={(event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const code = formData.get("code");
      redirect("missions?code=" + code);
    }}
  >
    <div className="row">
      <div className="col">
        <input
          className="form-control form-control-lg mb-2"
          type="number"
          placeholder="123456"
          name="code"
        />
      </div>
      <button className="btn mt-3 btn-primary" type="submit">
        Continuer
      </button>
    </div>
  </form>
);

export default MissionCodeForm;
