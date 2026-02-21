import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [aiOutput, setAiOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const callAI = async (endpoint, message) => {
    try {
      setLoading(true);
      setAiOutput("");

      const res = await axios.post(
        `http://127.0.0.1:9000${endpoint}`,
        { message }
      );

      const data = res.data;
      setAiOutput(data.response || data.email || data.analysis);
    } catch (err) {
      setAiOutput("❌ Error generating AI response.");
    } finally {
      setLoading(false);
    }
  };

  const renderOutput = (title) => (
    <div className="card-box mt-4">
      <h6 className="mb-3">{title}</h6>

      {loading && <div className="loading">Generating AI response...</div>}

      {!loading && (
        <div className="output-box">
          <div style={{ whiteSpace: "pre-wrap" }}>
            {aiOutput || "AI output will appear here..."}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="row">

        {/* Sidebar */}
        <div className="col-md-2 sidebar">
          <h4 className="mb-4">MarketMind</h4>

          <a
            className={`nav-link ${activeSection==="dashboard"?"active":""}`}
            onClick={()=>setActiveSection("dashboard")}
          >
            Dashboard
          </a>

          <a
            className={`nav-link ${activeSection==="campaign"?"active":""}`}
            onClick={()=>setActiveSection("campaign")}
          >
            Campaign Generator
          </a>

          <a
            className={`nav-link ${activeSection==="sales"?"active":""}`}
            onClick={()=>setActiveSection("sales")}
          >
            Sales Pitch
          </a>

          <a
            className={`nav-link ${activeSection==="insights"?"active":""}`}
            onClick={()=>setActiveSection("insights")}
          >
            Market Insights
          </a>
        </div>

        {/* Main Content */}
        <div className="col-md-10 p-4">

          {activeSection === "dashboard" && (
            <div>
              <h3 className="fw-bold mb-4">Dashboard</h3>
              {renderOutput("🤖 AI Recommendation")}
            </div>
          )}

          {activeSection === "campaign" && (
            <div>
              <h3 className="fw-bold mb-4">Campaign Generator</h3>

              <div className="card-box">
                <input
                  id="product"
                  className="form-control mb-3"
                  placeholder="Product Name"
                />
                <input
                  id="audience"
                  className="form-control mb-3"
                  placeholder="Target Audience"
                />

                <button
                  className="btn btn-primary"
                  onClick={()=>{
                    const msg = `Create marketing campaign for ${
                      document.getElementById("product").value
                    } targeting ${
                      document.getElementById("audience").value
                    }`;
                    callAI("/ai/analyze", msg);
                  }}
                >
                  Generate Campaign
                </button>
              </div>

              {renderOutput("Generated Campaign")}
            </div>
          )}

          {activeSection === "sales" && (
            <div>
              <h3 className="fw-bold mb-4">Sales Pitch Generator</h3>

              <div className="card-box">
                <textarea
                  id="pain"
                  className="form-control mb-3"
                  placeholder="Customer Pain Points"
                ></textarea>

                <button
                  className="btn btn-primary"
                  onClick={()=>{
                    const msg = `Generate sales pitch for customer with pain points: ${
                      document.getElementById("pain").value
                    }`;
                    callAI("/ai/generate-email", msg);
                  }}
                >
                  Generate Pitch
                </button>
              </div>

              {renderOutput("Generated Sales Pitch")}
            </div>
          )}

          {activeSection === "insights" && (
            <div>
              <h3 className="fw-bold mb-4">Market Insights</h3>

              <div className="card-box">
                <input
                  id="industry"
                  className="form-control mb-3"
                  placeholder="Enter Industry Name"
                />

                <button
                  className="btn btn-primary"
                  onClick={()=>{
                    const msg = `Provide competitor analysis for ${
                      document.getElementById("industry").value
                    }`;
                    callAI("/ai/competitor-analysis", msg);
                  }}
                >
                  Generate Insights
                </button>
              </div>

              {renderOutput("AI Market Insights")}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;