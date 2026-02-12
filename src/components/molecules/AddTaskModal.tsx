import { useState } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../../hooks/useApp";
import Modal from "../atoms/Modal";
import { Text } from "../atoms/Text";
import TextField from "../atoms/TextField";
import Dropdown from "../atoms/Dropdown";
import Button from "../atoms/Buttons";
import IconCross from "../../assets/images/icon-cross.svg?react";
import type { Column,} from "../../types/types";

export default function AddTaskModal() {
  const { boardId } = useParams();
  const { data } = useApp();
  

  const boardIndex = boardId ? Number(boardId) : 0;
  const currentBoard = data.boards?.[boardIndex];
  
 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState(["", ""]); // Default two empty subtasks
  const [status, setStatus] = useState(currentBoard?.columns?.[0]?.name || "");

  const statusOptions = currentBoard?.columns?.map((col: Column) => ({
    label: col.name,
    value: col.name,
  })) || [];

  const handleAddSubtask = () => setSubtasks([...subtasks, ""]);
  
  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubtaskChange = (index: number, value: string) => {
    const updated = [...subtasks];
    updated[index] = value;
    setSubtasks(updated);
  };

  return (
    <Modal>
      <div className="flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-2  custom-scrollbar">
        <Text variant="p1" className="text-foreground">
          Add New Task
        </Text>

        <form className="flex flex-col gap-6">
          {/* Task Title */}
          <TextField
            label="Title"
            placeholder="e.g. Take coffee break"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
        
          />

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label>
              <Text variant="p6" className="text-gray-400">Description</Text>
            </label>
            <textarea
              className="w-full h-28 px-4 py-2 rounded-sm bg-background-secondary border border-[#828fa340]  outline-none focus:border-primary text-[13px] leading-6 resize-none transition-all placeholder:opacity-25"
              placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Subtasks Section */}
          <div className="flex flex-col gap-3">
            <Text variant="p6" className="text-gray-400 font-bold">
              Subtasks
            </Text>
            {subtasks.map((sub, index) => (
              <div key={index} className="flex items-center gap-4">
                <TextField
                  placeholder={index === 0 ? "e.g. Make coffee" : "e.g. Drink coffee & smile"}
                  value={sub}
                  onChange={(e) => handleSubtaskChange(index, e.target.value)}
                  fullWidth
                  
                />
                <button aria-label='Remove subtask'
                  type="button" 
                  onClick={() => handleRemoveSubtask(index)}
                  className="group transition-colors"
                >
                  <IconCross className="fill-[#828FA3] group-hover:fill-danger" />
                </button>
              </div>
            ))}
            <Button 
              type="button" 
              variant="secondary" 
              size="md" 
              fullWidth 
              onClick={handleAddSubtask}
              className="hover:bg-interactive-dynamic hover:text-primary"
            >
              + Add New Subtask
            </Button>
          </div>

          
          <Dropdown
            label="Status"
            value={status}
            options={statusOptions}
            onChange={(val) => setStatus(val)}
            className="w-full"
        
          />

          
          <Button type="submit" variant="primary" fullWidth>
            Create Task
          </Button>
        </form>
      </div>
    </Modal>
  );
}